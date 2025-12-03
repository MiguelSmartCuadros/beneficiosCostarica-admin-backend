import { Router } from "express";
import { createStoreController } from "../controllers/stores/createStore.controller";
import { getAllStoresController } from "../controllers/stores/getAllStores.controller";
import { getStoreByIdController } from "../controllers/stores/getStoreById.controller";
import { updateStoreController } from "../controllers/stores/updateStore.controller";
import { deleteStoreController } from "../controllers/stores/deleteStore.controller";
import { uploadStoreImagesController } from "../controllers/stores/uploadStoreImages.controller";
import { getStoreImagesUrlsController } from "../controllers/stores/getStoreImagesUrls.controller";
import { getStoreImages } from "../middlewares/uploadImage.middleware";
import { verify_JWT } from "../middlewares/verifyToken";
import { isAdmin } from "../middlewares/isAdmin";

const storesRouter: Router = Router();

/**
 * @openapi
 * /stores/getall-stores:
 *   get:
 *     summary: Obtener todas las tiendas
 *     tags: [Stores]
 *     security:
 *       - x-access-token: []
 *     responses:
 *       200:
 *         description: Lista de tiendas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/stores'
 *       500:
 *         description: Error interno del servidor
 */
storesRouter.get("/getall-stores", getAllStoresController);

/**
 * @openapi
 * /stores/get-store/{id}:
 *   get:
 *     summary: Obtener una tienda por su ID
 *     tags: [Stores]
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tienda
 *     responses:
 *       200:
 *         description: Tienda obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/stores'
 *       404:
 *         description: Tienda no encontrada
 *       500:
 *         description: Error interno del servidor
 */
storesRouter.get("/get-store/:id", getStoreByIdController);

/**
 * @openapi
 * /stores/create-store:
 *   post:
 *     summary: Crear una nueva tienda
 *     tags: [Stores]
 *     security:
 *       - x-access-token: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               store_name:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               shop_type_id:
 *                 type: integer
 *               province_id:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               id_user_responsible:
 *                 type: integer
 *               store_img_card:
 *                 type: string
 *                 format: binary
 *               store_img_highlight:
 *                 type: string
 *                 format: binary
 *               store_img_banner:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tienda creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/stores'
 *       500:
 *         description: Error interno del servidor
 */
storesRouter.post("/create-store", verify_JWT, isAdmin, getStoreImages, createStoreController);

/**
 * @openapi
 * /stores/update-store/{id}:
 *   put:
 *     summary: Actualizar una tienda
 *     tags: [Stores]
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tienda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/stores'
 *     responses:
 *       200:
 *         description: Tienda actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/stores'
 *       404:
 *         description: Tienda no encontrada
 *       500:
 *         description: Error interno del servidor
 */
storesRouter.put("/update-store/:id", verify_JWT, isAdmin, updateStoreController);

/**
 * @openapi
 * /stores/delete-store/{id}:
 *   delete:
 *     summary: Eliminar una tienda
 *     tags: [Stores]
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tienda
 *     responses:
 *       200:
 *         description: Tienda eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Tienda no encontrada
 *       500:
 *         description: Error interno del servidor
 */
storesRouter.delete("/delete-store/:id", verify_JWT, isAdmin, deleteStoreController);

/**
 * @openapi
 * /stores/upload-images/{id}:
 *   post:
 *     summary: Subir imágenes para una tienda
 *     tags: [Stores]
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tienda
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               store_img_card:
 *                 type: string
 *                 format: binary
 *               store_img_highlight:
 *                 type: string
 *                 format: binary
 *               store_img_banner:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imágenes subidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/stores'
 *       400:
 *         description: Error en la solicitud (sin archivos o archivos inválidos)
 *       404:
 *         description: Tienda no encontrada
 *       500:
 *         description: Error interno del servidor
 */
storesRouter.post("/upload-images/:id", verify_JWT, isAdmin, getStoreImages, uploadStoreImagesController);

/**
 * @openapi
 * /stores/get-images-urls/{id}:
 *   get:
 *     summary: Obtener URLs firmadas de las imágenes de una tienda
 *     tags: [Stores]
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tienda
 *     responses:
 *       200:
 *         description: URLs de imágenes obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     store_img_card:
 *                       type: string
 *                       description: URL firmada de la imagen card
 *                     store_img_highlight:
 *                       type: string
 *                       description: URL firmada de la imagen highlight
 *                     store_img_banner:
 *                       type: string
 *                       description: URL firmada de la imagen banner
 *       404:
 *         description: Tienda no encontrada
 *       500:
 *         description: Error interno del servidor
 */
storesRouter.get("/get-images-urls/:id", getStoreImagesUrlsController);

export { storesRouter };
