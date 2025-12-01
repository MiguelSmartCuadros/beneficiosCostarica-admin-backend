import { Router } from "express";
import { createTipoDocumentoIdentidadController } from "../controllers/tipo_documento_identidad/createTipoDocumentoIdentidad.controller";
import { getAllTipoDocumentoIdentidadController } from "../controllers/tipo_documento_identidad/getAllTipoDocumentoIdentidad.controller";
import { getTipoDocumentoIdentidadByIdController } from "../controllers/tipo_documento_identidad/getTipoDocumentoIdentidadById.controller";
import { updateTipoDocumentoIdentidadController } from "../controllers/tipo_documento_identidad/updateTipoDocumentoIdentidad.controller";
import { deleteTipoDocumentoIdentidadController } from "../controllers/tipo_documento_identidad/deleteTipoDocumentoIdentidad.controller";
import { verify_JWT } from "../middlewares/verifyToken";
import { isAdmin } from "../middlewares/isAdmin";

const tipoDocumentoIdentidadRouter: Router = Router();

/**
 * @openapi
 * /document-type/getall-document-types:
 *   get:
 *     tags: [Document Type]
 *     summary: Obtener todos los tipos de documento de identidad
 *     security:
 *       - x-access-token: []
 *     responses:
 *       200:
 *         description: Lista de tipos de documento obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      tiposDocumento:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: number
 *                                  codigo:
 *                                      type: string
 *                                  descripcion:
 *                                      type: string
 *                      total:
 *                          type: number
 *       500:
 *         description: Error interno del servidor
 */
tipoDocumentoIdentidadRouter.get("/getall-document-types", verify_JWT, isAdmin, getAllTipoDocumentoIdentidadController);

/**
 * @openapi
 * /document-type/get-document-type/{id}:
 *   get:
 *     tags: [Document Type]
 *     summary: Obtener un tipo de documento de identidad por su ID
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de documento
 *     responses:
 *       200:
 *         description: Tipo de documento obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      tipoDocumento:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: number
 *                              codigo:
 *                                  type: string
 *                              descripcion:
 *                                  type: string
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Tipo de documento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
tipoDocumentoIdentidadRouter.get("/get-document-type/:id", verify_JWT, isAdmin, getTipoDocumentoIdentidadByIdController);

/**
 * @openapi
 * /document-type/create-document-type:
 *   post:
 *     tags: [Document Type]
 *     summary: Crear un nuevo tipo de documento de identidad
 *     security:
 *       - x-access-token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               required:
 *                 - codigo
 *                 - descripcion
 *               properties:
 *                   codigo:
 *                       type: string
 *                       description: Código del tipo de documento
 *                       example: "01"
 *                   descripcion:
 *                       type: string
 *                       description: Descripción del tipo de documento
 *                       example: "Cédula de Identidad"
 *     responses:
 *       201:
 *         description: Tipo de documento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                      tipoDocumento:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: number
 *                              codigo:
 *                                  type: string
 *                              descripcion:
 *                                  type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: El código de tipo de documento ya existe
 *       500:
 *         description: Error interno del servidor
 */
tipoDocumentoIdentidadRouter.post("/create-document-type", verify_JWT, isAdmin, createTipoDocumentoIdentidadController);

/**
 * @openapi
 * /document-type/update-document-type/{id}:
 *   put:
 *     tags: [Document Type]
 *     summary: Actualizar un tipo de documento de identidad
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de documento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                   codigo:
 *                       type: string
 *                   descripcion:
 *                       type: string
 *     responses:
 *       200:
 *         description: Tipo de documento actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                      tipoDocumento:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: number
 *                              codigo:
 *                                  type: string
 *                              descripcion:
 *                                  type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Tipo de documento no encontrado
 *       409:
 *         description: El código de tipo de documento ya existe
 *       500:
 *         description: Error interno del servidor
 */
tipoDocumentoIdentidadRouter.put("/update-document-type/:id", verify_JWT, isAdmin, updateTipoDocumentoIdentidadController);

/**
 * @openapi
 * /document-type/delete-document-type/{id}:
 *   delete:
 *     tags: [Document Type]
 *     summary: Eliminar un tipo de documento de identidad
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de documento
 *     responses:
 *       200:
 *         description: Tipo de documento eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Tipo de documento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
tipoDocumentoIdentidadRouter.delete("/delete-document-type/:id", verify_JWT, isAdmin, deleteTipoDocumentoIdentidadController);

export { tipoDocumentoIdentidadRouter };
