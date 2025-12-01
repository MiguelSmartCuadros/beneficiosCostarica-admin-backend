# 🏋️ Beneficios Costa Rica - Admin Backend

Backend API REST para la gestión del sistema de beneficios corporativos de **Smart Fit Costa Rica**.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey.svg)](https://expressjs.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.33-blue.svg)](https://sequelize.org/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Base de Datos](#-base-de-datos)
- [Seguridad](#-seguridad)
- [Scripts Disponibles](#-scripts-disponibles)
- [Documentación](#-documentación)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## 📖 Descripción

Sistema backend completo para la administración de beneficios corporativos de Smart Fit Costa Rica. Permite gestionar tiendas, usuarios, categorías, códigos de descuento y elementos de texto asociados a los beneficios.

### Funcionalidades Principales

- 🔐 **Autenticación y Autorización**: Sistema JWT con roles de usuario
- 👥 **Gestión de Usuarios**: CRUD completo con perfiles y roles
- 🏪 **Gestión de Tiendas**: Administración de comercios afiliados
- 🎫 **Códigos de Descuento**: Creación y gestión de códigos promocionales
- 📝 **Elementos de Texto**: Gestión de contenido HTML con sanitización
- 🌍 **Provincias y Categorías**: Organización geográfica y por tipo
- 📧 **Sistema de Emails**: Recuperación de contraseña y notificaciones
- 📊 **Documentación Swagger**: API completamente documentada

---

## ✨ Características

### Seguridad

- ✅ Autenticación JWT con tokens de acceso
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Sanitización HTML para prevenir XSS
- ✅ Protección contra SQL Injection (Sequelize ORM)
- ✅ CORS configurado con orígenes permitidos
- ✅ Helmet para headers de seguridad
- ✅ Validación de roles (Admin, Corp)
- ✅ Transacciones de base de datos para integridad

### Funcionalidades Técnicas

- ✅ API RESTful con Express.js
- ✅ ORM Sequelize para MySQL
- ✅ TypeScript para type safety
- ✅ Logging con Winston
- ✅ Documentación Swagger/OpenAPI 3.0
- ✅ Paginación en endpoints de listado
- ✅ Relaciones Many-to-Many optimizadas
- ✅ Middleware de validación y sanitización

---

## 🛠️ Tecnologías

### Core

- **Runtime**: Node.js 18+
- **Lenguaje**: TypeScript 5.0
- **Framework**: Express.js 4.18
- **Base de Datos**: MySQL 8.0
- **ORM**: Sequelize 6.33

### Seguridad

- **Autenticación**: JSON Web Tokens (JWT)
- **Encriptación**: bcrypt
- **Sanitización**: Custom HTML sanitizer
- **Headers**: Helmet
- **CORS**: cors

### Utilidades

- **Logging**: Winston
- **Email**: Nodemailer
- **Documentación**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Validación**: validator
- **Dev Tools**: ts-node-dev, nodemon

---

## 📦 Requisitos Previos

- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior
- **MySQL**: v8.0 o superior
- **Git**: Para clonar el repositorio

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd beneficiosCostarica-admin-backend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

```bash
cp .example.env .env
```

Editar el archivo `.env` con tus credenciales:

```env
# Base de Datos
USER_NAME=tu_usuario_mysql
PASSWORD=tu_password_mysql
DB_NAME=nombre_base_datos
DB_ENDPOINT=localhost
DB_PORT=3306

# JWT
WORD_SECRET=tu_secret_key_muy_seguro
TIME_TOKEN=24h
TIME_RESET_TOKEN=1h

# Servidor
EXPOSE_PORT=3001

# Email
HOST_EMAIL=smtp.gmail.com
USER_EMAIL=tu_email@gmail.com
PASSWORD_EMAIL=tu_password_email

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200

# Bcrypt
BCRYPT_SALT_ROUNDS=10
```

### 4. Crear Base de Datos

```sql
CREATE DATABASE nombre_base_datos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Compilar TypeScript

```bash
npm run start:build
```

---

## ⚙️ Configuración

### Variables de Entorno Importantes

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_NAME` | Nombre de la base de datos | `dbcrbeneficios` |
| `DB_ENDPOINT` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `WORD_SECRET` | Secret para JWT | `mi_secret_super_seguro_123` |
| `EXPOSE_PORT` | Puerto del servidor | `3001` |
| `ALLOWED_ORIGINS` | Orígenes CORS permitidos | `http://localhost:3000` |
| `TIME_TOKEN` | Duración del token JWT | `24h` |
| `BCRYPT_SALT_ROUNDS` | Rounds de bcrypt | `10` |

### Configuración de CORS

Los orígenes permitidos se configuran en `ALLOWED_ORIGINS` separados por comas. Se aceptan expresiones regulares.

---

## 🎯 Uso

### Desarrollo

```bash
npm run start:dev
```

El servidor se iniciará en `http://localhost:3001` con hot-reload.

### Producción

#### Opción 1: Node.js

```bash
npm run start:Prod
```

#### Opción 2: PM2 (Recomendado)

```bash
npm run start:Prod:PM2
```

Para detener:

```bash
npm run stop:Prod:PM2
```

### Acceder a la Documentación

Una vez iniciado el servidor, accede a:

```
http://localhost:3001/WebServices/doc
```

---

## 📁 Estructura del Proyecto

```
beneficiosCostarica-admin-backend/
├── src/
│   ├── app.ts                    # Configuración de Express
│   ├── index.ts                  # Punto de entrada
│   ├── connections/              # Conexión a BD y relaciones
│   │   ├── dbConnection.ts
│   │   └── modelRelations.ts
│   ├── models/                   # Modelos Sequelize (13)
│   │   ├── Users.ts
│   │   ├── UserProfile.ts
│   │   ├── Stores.ts
│   │   ├── DiscountCodes.ts
│   │   └── ...
│   ├── interfaces/               # Interfaces TypeScript (16)
│   │   ├── users.interface.ts
│   │   ├── stores.interface.ts
│   │   └── ...
│   ├── services/                 # Lógica de negocio (12 módulos)
│   │   ├── auth/
│   │   ├── users/
│   │   ├── stores/
│   │   ├── discount_codes/
│   │   └── ...
│   ├── controllers/              # Controladores (12 módulos)
│   │   ├── auth/
│   │   ├── users/
│   │   ├── stores/
│   │   └── ...
│   ├── routes/                   # Definición de rutas (15)
│   │   ├── index.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   └── ...
│   ├── middlewares/              # Middlewares personalizados (5)
│   │   ├── verifyToken.ts
│   │   ├── isAdmin.ts
│   │   ├── sanitizeHtml.ts
│   │   └── ...
│   ├── documentation/            # Configuración Swagger
│   │   └── swagger.ts
│   ├── mail/                     # Sistema de emails
│   │   ├── sender.ts
│   │   └── templates/
│   └── logger/                   # Sistema de logs
│       └── logger.ts
├── dist/                         # Código compilado
├── .env                          # Variables de entorno
├── .example.env                  # Ejemplo de variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🌐 API Endpoints

### Base URL

```
http://localhost:3001/WebServices
```

### Módulos Disponibles

#### 🔐 Autenticación (`/auth`)

- `POST /login` - Iniciar sesión
- `POST /signup` - Registrar usuario (Admin)
- `POST /forgot-password` - Solicitar recuperación
- `POST /reset-password` - Resetear contraseña
- `GET /verify-token` - Verificar token

#### 👥 Usuarios (`/users`)

- `GET /getall-users` - Listar usuarios
- `GET /get-user/:id` - Obtener usuario
- `PUT /update-user/:id` - Actualizar usuario
- `DELETE /delete-user/:id` - Eliminar usuario

#### 🏪 Tiendas (`/stores`)

- `POST /create-store` - Crear tienda
- `GET /getall-stores` - Listar tiendas
- `GET /get-store/:id` - Obtener tienda
- `PUT /update-store/:id` - Actualizar tienda
- `DELETE /delete-store/:id` - Eliminar tienda

#### 🎫 Códigos de Descuento (`/discount-codes`)

- `POST /create-discount-code` - Crear código
- `GET /getall-discount-codes` - Listar códigos
- `GET /get-discount-code/:id` - Obtener código
- `PUT /update-discount-code/:id` - Actualizar código
- `DELETE /delete-discount-code/:id` - Eliminar código

#### 📝 Elementos de Texto (`/text-elements`)

- `POST /create-text-element` - Crear elemento
- `GET /getall-text-elements` - Listar elementos
- `GET /get-text-element/:id` - Obtener elemento
- `PUT /update-text-element/:id` - Actualizar elemento
- `DELETE /delete-text-element/:id` - Eliminar elemento

#### Otros Módulos

- `/categories` - Gestión de categorías
- `/typeshops` - Gestión de tipos de tienda
- `/provinces` - Gestión de provincias
- `/user-roles` - Gestión de roles
- `/tipo-documento-identidad` - Tipos de documento
- `/typeshop-profile` - Perfiles de tipo de tienda
- `/province-x-store` - Relaciones provincia-tienda
- `/asigned-codes-user` - Códigos asignados

### Autenticación

La mayoría de endpoints requieren autenticación JWT. Incluir el token en el header:

```
x-access-token: <tu_token_jwt>
```

---

## 🗄️ Base de Datos

### Esquema Principal

El proyecto utiliza 13 tablas principales:

#### Tablas de Usuarios

- `users` - Usuarios del sistema
- `user_profile` - Perfiles de usuario
- `user_roles` - Roles (ADMIN, CORP)
- `tipo_documento_identidad` - Tipos de documento

#### Tablas de Tiendas

- `stores` - Tiendas/comercios afiliados
- `categories` - Categorías de tiendas
- `typeshops` - Tipos de tienda
- `provinces` - Provincias de Costa Rica

#### Tablas de Contenido

- `text_elements` - Elementos de texto HTML
- `discount_codes` - Códigos de descuento

#### Tablas Relacionales

- `typeshop_profile` - Relación stores ↔ typeshops
- `province_x_store` - Relación stores ↔ provinces
- `asigned_codes_user` - Códigos asignados a usuarios

### Relaciones Principales

```
Users (1) ──→ (1) UserProfile
Users (1) ──→ (N) Stores (responsable)
Users (N) ──→ (1) UserRoles

Stores (N) ──→ (1) Categories
Stores (N) ──→ (1) Typeshops
Stores (N) ──→ (1) Provinces
Stores (1) ──→ (N) TextElements
Stores (1) ──→ (N) DiscountCodes

Stores (M) ←→ (N) Typeshops (via typeshop_profile)
Stores (M) ←→ (N) Provinces (via province_x_store)
```

---

## 🔒 Seguridad

### Autenticación JWT

- Tokens generados en `/auth/login`
- Duración configurable (default: 24h)
- Verificación en middleware `verify_JWT`

### Autorización por Roles

- **ROLE_ADMIN**: Acceso completo
- **ROLE_CORP**: Acceso limitado a su tienda

### Sanitización HTML

Los campos HTML de `text_elements` son sanitizados automáticamente para prevenir:

- SQL Injection
- XSS (Cross-Site Scripting)
- Ejecución de código malicioso

### Transacciones

Operaciones críticas usan transacciones:

- Creación de usuario + perfil
- Eliminación de usuario + perfil
- Actualización de usuario + perfil

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Servidor con hot-reload
npm run start:build:dev    # Compilar y ejecutar con nodemon

# Producción
npm run start:build        # Compilar TypeScript
npm run start              # Ejecutar servidor
npm run start:Prod         # Compilar y ejecutar
npm run start:Prod:PM2     # Ejecutar con PM2
npm run stop:Prod:PM2      # Detener PM2

# Utilidades
npm run tsc:init           # Inicializar tsconfig.json
```

---

## 📚 Documentación

### Swagger UI

Accede a la documentación interactiva en:

```
http://localhost:3001/WebServices/doc
```

### Changelogs

- `CHANGELOG_SESSION_2025-11-27.md` - Cambios de text_elements y users
- `CHANGELOG_province_x_store.md` - Implementación de province_x_store
- `CHANGELOG_typeshop_discount_codes.md` - TypeshopProfile M:N y DiscountCodes
- `SECURITY_HTML_SANITIZATION.md` - Documentación de seguridad HTML
- `VERIFICATION_FINAL.md` - Verificación completa del proyecto

---

## 🤝 Contribución

### Guía de Estilo

- **TypeScript**: Strict mode habilitado
- **Naming**: camelCase para variables, PascalCase para clases
- **Imports**: Organizados por categoría
- **Comentarios**: JSDoc para funciones públicas

### Proceso de Contribución

1. Fork el repositorio
2. Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

---

## 👨‍💻 Equipo

- **Desarrollador**: Miguel Tabares
- **Email**: miguel.cuadros@smartfit.com
- **Compañía**: Smart Fit Costa Rica
- **Versión**: 1.0.0

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

## 🙏 Agradecimientos

- Equipo de Smart Fit Costa Rica
- TechnoApes Company (desarrollo inicial)
- Comunidad de TypeScript y Node.js

---

## 📞 Soporte

Para preguntas o soporte:

- **Email**: miguel.cuadros@smartfit.com
- **Documentación**: Ver `/WebServices/doc`
- **Issues**: Crear issue en el repositorio

---

## 🔄 Actualizaciones Recientes

### v1.0.0 (30 Nov 2025)

- ✅ Implementación completa de 13 tablas
- ✅ 19 relaciones configuradas
- ✅ ~70 endpoints documentados
- ✅ Sistema de seguridad completo
- ✅ Sanitización HTML
- ✅ CRUD de DiscountCodes
- ✅ Relaciones M:N optimizadas
- ✅ 100% listo para producción

---

**Desarrollado con ❤️ para Smart Fit Costa Rica**
