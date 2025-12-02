import { Router } from "express";
import { createTypeshopUrlsController } from "../controllers/typeshop_urls/createTypeshopUrls.controller";
import { getAllTypeshopUrlsController } from "../controllers/typeshop_urls/getAllTypeshopUrls.controller";
import { getTypeshopUrlsByIdController } from "../controllers/typeshop_urls/getTypeshopUrlsById.controller";
import { updateTypeshopUrlsController } from "../controllers/typeshop_urls/updateTypeshopUrls.controller";
import { deleteTypeshopUrlsController } from "../controllers/typeshop_urls/deleteTypeshopUrls.controller";
import { verify_JWT } from "../middlewares/verifyToken";
import { isAdmin } from "../middlewares/isAdmin";

const typeshopUrlsRouter: Router = Router();

/**
 * @openapi
 * /typeshop-urls/getall-typeshop-urls:
 *   get:
 *     tags: [Typeshop Urls]
 *     summary: Obtener todas las URLs de tipo de tienda
 *     security:
 *       - x-access-token: []
 *     responses:
 *       200:
 *         description: Lista de URLs obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      typeshopUrls:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id_typeshop_urls:
 *                                      type: number
 *                                  store_id:
 *                                      type: number
 *                                  typeshop_id:
 *                                      type: number
 *                                  url_store:
 *                                      type: string
 *                      total:
 *                          type: number
 *       500:
 *         description: Error interno del servidor
 */
typeshopUrlsRouter.get("/getall-typeshop-urls", verify_JWT, isAdmin, getAllTypeshopUrlsController);

/**
 * @openapi
 * /typeshop-urls/get-typeshop-urls/{id}:
 *   get:
 *     tags: [Typeshop Urls]
 *     summary: Obtener una URL de tipo de tienda por su ID
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la URL
 *     responses:
 *       200:
 *         description: URL obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      typeshopUrls:
 *                          type: object
 *                          properties:
 *                              id_typeshop_urls:
 *                                  type: number
 *                              store_id:
 *                                  type: number
 *                              typeshop_id:
 *                                  type: number
 *                              url_store:
 *                                  type: string
 *       400:
 *         description: ID inválido
 *       404:
 *         description: URL no encontrada
 *       500:
 *         description: Error interno del servidor
 */
typeshopUrlsRouter.get("/get-typeshop-urls/:id", verify_JWT, isAdmin, getTypeshopUrlsByIdController);

/**
 * @openapi
 * /typeshop-urls/create-typeshop-urls:
 *   post:
 *     tags: [Typeshop Urls]
 *     summary: Crear una nueva URL de tipo de tienda
 *     security:
 *       - x-access-token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               required:
 *                 - store_id
 *                 - typeshop_id
 *                 - url
 *               properties:
 *                   store_id:
 *                       type: number
 *                       description: ID de la tienda
 *                   typeshop_id:
 *                       type: number
 *                       description: ID del tipo de tienda
 *                   url_store:
 *                       type: string
 *                       description: URL de la tienda
 *     responses:
 *       201:
 *         description: URL creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                      typeshopUrls:
 *                          type: object
 *                          properties:
 *                              id_typeshop_urls:
 *                                  type: number
 *                              store_id:
 *                                  type: number
 *                              typeshop_id:
 *                                  type: number
 *                              url_store:
 *                                  type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Store o Typeshop no encontrado
 *       500:
 *         description: Error interno del servidor
 */
typeshopUrlsRouter.post("/create-typeshop-urls", verify_JWT, isAdmin, createTypeshopUrlsController);

/**
 * @openapi
 * /typeshop-urls/update-typeshop-urls/{id}:
 *   put:
 *     tags: [Typeshop Urls]
 *     summary: Actualizar una URL de tipo de tienda
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la URL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                   store_id:
 *                       type: number
 *                   typeshop_id:
 *                       type: number
 *                   url_store:
 *                       type: string
 *     responses:
 *       200:
 *         description: URL actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                      typeshopUrls:
 *                          type: object
 *                          properties:
 *                              id_typeshop_urls:
 *                                  type: number
 *                              store_id:
 *                                  type: number
 *                              typeshop_id:
 *                                  type: number
 *                              url_store:
 *                                  type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: URL, Store o Typeshop no encontrado
 *       500:
 *         description: Error interno del servidor
 */
typeshopUrlsRouter.put("/update-typeshop-urls/:id", verify_JWT, isAdmin, updateTypeshopUrlsController);

/**
 * @openapi
 * /typeshop-urls/delete-typeshop-urls/{id}:
 *   delete:
 *     tags: [Typeshop Urls]
 *     summary: Eliminar una URL de tipo de tienda
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la URL
 *     responses:
 *       200:
 *         description: URL eliminada exitosamente
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
 *         description: URL no encontrada
 *       500:
 *         description: Error interno del servidor
 */
typeshopUrlsRouter.delete("/delete-typeshop-urls/:id", verify_JWT, isAdmin, deleteTypeshopUrlsController);

export { typeshopUrlsRouter };
