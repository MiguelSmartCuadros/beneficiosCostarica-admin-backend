import { Router } from "express";
import { createProvinceXStoreController } from "../controllers/province_x_store/createProvinceXStore.controller";
import { getAllProvinceXStoreController } from "../controllers/province_x_store/getAllProvinceXStore.controller";
import { getProvinceXStoreByIdController } from "../controllers/province_x_store/getProvinceXStoreById.controller";
import { updateProvinceXStoreController } from "../controllers/province_x_store/updateProvinceXStore.controller";
import { deleteProvinceXStoreController } from "../controllers/province_x_store/deleteProvinceXStore.controller";
import { verify_JWT } from "../middlewares/verifyToken";
import { isAdmin } from "../middlewares/isAdmin";

const provinceXStoreRouter: Router = Router();

/**
 * @openapi
 * /province-x-store/getall-province-x-store:
 *   get:
 *     tags: [Province X Store]
 *     summary: Obtener todas las relaciones provincia-tienda
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Lista de relaciones provincia-tienda obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      provinceXStores:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: number
 *                                  province_id:
 *                                      type: number
 *                                  store_id:
 *                                      type: number
 *                                  province:
 *                                      type: object
 *                                      properties:
 *                                          id_province:
 *                                              type: number
 *                                          province_name:
 *                                              type: string
 *                                  store:
 *                                      type: object
 *                                      properties:
 *                                          id_stores:
 *                                              type: number
 *                                          store_name:
 *                                              type: string
 *                      total:
 *                          type: number
 *                      page:
 *                          type: number
 *                      totalPages:
 *                          type: number
 *       500:
 *         description: Error interno del servidor
 */
provinceXStoreRouter.get("/getall-province-x-store", verify_JWT, isAdmin, getAllProvinceXStoreController);

/**
 * @openapi
 * /province-x-store/get-province-x-store/{id}:
 *   get:
 *     tags: [Province X Store]
 *     summary: Obtener una relación provincia-tienda por su ID
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la relación provincia-tienda
 *     responses:
 *       200:
 *         description: Relación provincia-tienda obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      provinceXStore:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: number
 *                              province_id:
 *                                  type: number
 *                              store_id:
 *                                  type: number
 *                              province:
 *                                  type: object
 *                                  properties:
 *                                      id_province:
 *                                          type: number
 *                                      province_name:
 *                                          type: string
 *                              store:
 *                                  type: object
 *                                  properties:
 *                                      id_stores:
 *                                          type: number
 *                                      store_name:
 *                                          type: string
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Relación provincia-tienda no encontrada
 *       500:
 *         description: Error interno del servidor
 */
provinceXStoreRouter.get("/get-province-x-store/:id", verify_JWT, isAdmin, getProvinceXStoreByIdController);

/**
 * @openapi
 * /province-x-store/create-province-x-store:
 *   post:
 *     tags: [Province X Store]
 *     summary: Crear una nueva relación provincia-tienda
 *     security:
 *       - x-access-token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               required:
 *                 - province_id
 *                 - store_id
 *               properties:
 *                   province_id:
 *                       type: number
 *                       description: ID de la provincia
 *                       example: 1
 *                   store_id:
 *                       type: number
 *                       description: ID de la tienda
 *                       example: 1
 *     responses:
 *       201:
 *         description: Relación provincia-tienda creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                      provinceXStore:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: number
 *                              province_id:
 *                                  type: number
 *                              store_id:
 *                                  type: number
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: La relación ya existe
 *       500:
 *         description: Error interno del servidor
 */
provinceXStoreRouter.post("/create-province-x-store", verify_JWT, isAdmin, createProvinceXStoreController);

/**
 * @openapi
 * /province-x-store/update-province-x-store/{id}:
 *   put:
 *     tags: [Province X Store]
 *     summary: Actualizar una relación provincia-tienda
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la relación provincia-tienda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                   province_id:
 *                       type: number
 *                       description: ID de la provincia
 *                   store_id:
 *                       type: number
 *                       description: ID de la tienda
 *     responses:
 *       200:
 *         description: Relación provincia-tienda actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                      provinceXStore:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: number
 *                              province_id:
 *                                  type: number
 *                              store_id:
 *                                  type: number
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Relación provincia-tienda no encontrada
 *       409:
 *         description: La relación ya existe
 *       500:
 *         description: Error interno del servidor
 */
provinceXStoreRouter.put("/update-province-x-store/:id", verify_JWT, isAdmin, updateProvinceXStoreController);

/**
 * @openapi
 * /province-x-store/delete-province-x-store/{id}:
 *   delete:
 *     tags: [Province X Store]
 *     summary: Eliminar una relación provincia-tienda
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la relación provincia-tienda
 *     responses:
 *       200:
 *         description: Relación provincia-tienda eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                      deletedId:
 *                          type: string
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Relación provincia-tienda no encontrada
 *       500:
 *         description: Error interno del servidor
 */
provinceXStoreRouter.delete("/delete-province-x-store/:id", verify_JWT, isAdmin, deleteProvinceXStoreController);

export { provinceXStoreRouter };
