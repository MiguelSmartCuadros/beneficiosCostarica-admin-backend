# Documentación de Implementación: Carga y Gestión de Imágenes en S3

Esta documentación detalla la implementación completa realizada para permitir la subida, almacenamiento y recuperación de imágenes (Card, Highlight, Banner) para las tiendas (`stores`) utilizando AWS S3.

## Resumen del Flujo

1.  **Subida (Upload)**:
    *   El cliente envía archivos (imágenes) a través de los endpoints `POST /create-store` o `POST /upload-images/:id`.
    *   El middleware `getStoreImages` intercepta la solicitud, valida que sean imágenes y las guarda temporalmente en memoria.
    *   El controlador (`createStore` o `uploadStoreImages`) recibe los archivos, los sube a S3 usando el servicio `uploadToS3`, obtiene una "key" (identificador único) y guarda esa key en la base de datos.

2.  **Recuperación (Retrieval)**:
    *   El cliente solicita las URLs de las imágenes mediante `GET /get-images-urls/:id`.
    *   El controlador `getStoreImagesUrls` busca las keys en la base de datos.
    *   Genera URLs firmadas (presigned URLs) temporales usando el servicio `getPresignedURL` y las devuelve al cliente.

---

## Detalle de Archivos Implementados

### 1. Configuración y Servicios AWS

#### `src/AWS/S3/s3Client.ts`
Este archivo inicializa el cliente de AWS S3.
```typescript
import { S3Client } from "@aws-sdk/client-s3";

const region: string = process.env.AWS_REGION!; // Obtiene la región de las variables de entorno

// Crea e exporta una instancia del cliente S3 con la configuración regional
export const s3Client = new S3Client({
  region,
});
```

#### `src/AWS/S3/uploadToS3.service.ts`
Servicio encargado de subir un archivo físico a un bucket de S3.
```typescript
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid"; // Para generar nombres únicos
import { s3Client } from "./s3Client";
// ... imports de interfaces

export async function uploadToS3(fileBuffer: Buffer, fileName: string, mimetype: string): Promise<string> {
  // ... validaciones de variables de entorno

  const bucketName = process.env.AWS_BUCKET_NAME!;
  const key = `${uuidv4()} - ${fileName}`; // Genera un nombre único para el archivo: "UUID - NombreOriginal"

  // Configura los parámetros para la subida
  const uploadParams = {
    Bucket: bucketName,
    Key: key, // El nombre con el que se guardará en S3
    Body: fileBuffer, // El contenido del archivo en binario
    ContentType: mimetype, // El tipo de archivo (ej. image/png)
  };

  // Envía el comando a S3
  const command: PutObjectCommand = new PutObjectCommand(uploadParams);
  await s3Client.send(command);

  return key; // Retorna la key para guardarla en la BD
}
```

#### `src/AWS/S3/getPresignedURL.service.ts`
Servicio para generar URLs temporales de acceso a archivos privados en S3.
```typescript
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./s3Client";

export async function getPresignedURL(objectKey: string): Promise<string> {
  // ... validaciones

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: objectKey, // La key del archivo que queremos acceder
  });

  // Genera una URL firmada válida por 3600 segundos (1 hora)
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
}
```

---

### 2. Middleware

#### `src/middlewares/uploadImage.middleware.ts`
Middleware basado en `multer` para procesar la subida de archivos antes de llegar al controlador.
```typescript
import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback, MulterError } from "multer";
// ... imports

// Configura almacenamiento en memoria (RAM) para no guardar archivos en disco del servidor
const storage = multer.memoryStorage();

// Filtro para aceptar solo imágenes
const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("El archivo debe ser una imagen válida (JPEG, JPG, PNG)"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Límite de 5MB
});

// Función middleware exportada
export const getStoreImages = (req: Request, res: Response, next: NextFunction) => {
  // Configura los campos esperados
  const uploadFields = upload.fields([
    { name: "store_img_card", maxCount: 1 },
    { name: "store_img_highlight", maxCount: 1 },
    { name: "store_img_banner", maxCount: 1 },
  ]);

  // Ejecuta multer y maneja errores
  uploadFields(req, res, (err: any) => {
    if (err instanceof MulterError) {
        // Error de multer (ej. archivo muy grande)
        return errorResponse(res, { ...errorData, statusCode: 400 });
    } else if (err) {
        // Error del filtro (ej. tipo de archivo inválido)
        return errorResponse(res, { ...errorData, statusCode: 500 });
    } else {
        // Todo OK, pasa al controlador
        next();
    }
  });
};
```

---

### 3. Controladores

#### `src/controllers/stores/createStore.controller.ts`
Modificado para manejar imágenes durante la creación de la tienda.
```typescript
// ... imports

export const createStoreController = async (req: Request, res: Response) => {
  try {
    const storeData = req.body;
    // Accede a los archivos procesados por el middleware
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Verifica si se subió 'store_img_card'
    if (files && files["store_img_card"] && files["store_img_card"][0]) {
      const file = files["store_img_card"][0];
      // Sube a S3 y guarda la key en el objeto de datos de la tienda
      const key = await uploadToS3(file.buffer, file.originalname, file.mimetype);
      storeData.store_img_card = key;
    }

    // ... (Repite lógica para highlight y banner)

    // Crea la tienda en la BD con los datos (incluyendo las keys de las imágenes)
    const newStore = await createStoreService(storeData);
    
    return res.status(201).json({ ... });
  } catch (error) { ... }
};
```

#### `src/controllers/stores/uploadStoreImages.controller.ts`
Controlador dedicado para actualizar imágenes de una tienda existente.
```typescript
// ... imports

export const uploadStoreImagesController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const files = req.files as { ... };
    const updateData: any = {};

    // Procesa cada archivo, lo sube a S3 y agrega la key al objeto de actualización
    if (files["store_img_card"]) {
        const key = await uploadToS3(...);
        updateData.store_img_card = key;
    }
    // ... (otros archivos)

    // Actualiza la tienda en la BD solo con los campos de imágenes nuevos
    const updatedStore = await updateStoreService(Number(id), updateData);

    return res.status(200).json({ ... });
  } catch (error) { ... }
};
```

#### `src/controllers/stores/getStoreImagesUrls.controller.ts`
Controlador para obtener las URLs de visualización.
```typescript
// ... imports

export const getStoreImagesUrlsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const store = await Stores.findByPk(Number(id)); // Busca la tienda

    // ... validación si existe

    const imageUrls: any = {};

    // Si la tienda tiene una key de imagen guardada, genera su URL firmada
    if (storeData.store_img_card) {
      imageUrls.store_img_card = await getPresignedURL(storeData.store_img_card);
    }
    // ... (otras imágenes)

    // Devuelve el objeto con las URLs listas para usar en el frontend
    return res.status(200).json({
      success: true,
      data: imageUrls,
    });
  } catch (error) { ... }
};
```

---

### 4. Rutas

#### `src/routes/stores.routes.ts`
Define los endpoints y conecta middlewares y controladores.

```typescript
// ... imports

// Endpoint para crear tienda (ahora soporta imágenes)
// Usa 'getStoreImages' antes del controlador para procesar el multipart/form-data
storesRouter.post("/create-store", verify_JWT, isAdmin, getStoreImages, createStoreController);

// Endpoint específico para subir/actualizar imágenes de una tienda existente
storesRouter.post("/upload-images/:id", verify_JWT, isAdmin, getStoreImages, uploadStoreImagesController);

// Endpoint para obtener las URLs de las imágenes
storesRouter.get("/get-images-urls/:id", getStoreImagesUrlsController);
```
