import { Router } from "express";
import { createProvinceController } from "../controllers/provinces/createProvince.controller";
import { getAllProvincesController } from "../controllers/provinces/getAllProvinces.controller";
import { getProvinceByIdController } from "../controllers/provinces/getProvinceById.controller";
import { updateProvinceController } from "../controllers/provinces/updateProvince.controller";
import { deleteProvinceController } from "../controllers/provinces/deleteProvince.controller";
import { verify_JWT } from "../middlewares/verifyToken";
import { isAdmin } from "../middlewares/isAdmin";

const provincesRouter: Router = Router();

/**
 * @openapi
 * /provinces/getall-provinces:
 *   get:
 *     tags: [Provincias]
 *     summary: Obtener todas las provincias
 *     security:
 *       - x-access-token: []
 *     responses:
 *       200:
 *         description: Lista de provincias obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      provinces:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id_province:
 *                                      type: number
 *                                  province_name:
 *                                      type: string
 *                      total:
 *                          type: number
 *       500:
 *         description: Error interno del servidor
 */
provincesRouter.get("/getall-provinces", verify_JWT, isAdmin, getAllProvincesController);

/**
 * @openapi
 * /provinces/get-province/{id}:
 *   get:
 *     tags: [Provincias]
 *     summary: Obtener una provincia por su ID
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la provincia
 *     responses:
 *       200:
 *         description: Provincia obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      province:
 *                          type: object
 *                          properties:
 *                              id_province:
 *                                  type: number
 *                              province_name:
 *                                  type: string
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Provincia no encontrada
 *       500:
 *         description: Error interno del servidor
 */
provincesRouter.get("/get-province/:id", verify_JWT, isAdmin, getProvinceByIdController);

/**
 * @openapi
 * /provinces/create-province:
 *   post:
 *     tags: [Provincias]
 *     summary: Crear una nueva provincia
 *     security:
 *       - x-access-token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               required:
 *                 - province_name
 *               properties:
 *                   province_name:
 *                       type: string
 *                       description: Nombre de la provincia
 *                       example: "San José"
 *     responses:
 *       201:
 *         description: Provincia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                      province:
 *                          type: object
 *                          properties:
 *                              id_province:
 *                                  type: number
 *                              province_name:
 *                                  type: string
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: La provincia ya existe
 *       500:
 *         description: Error interno del servidor
 */
provincesRouter.post("/create-province", verify_JWT, isAdmin, createProvinceController);

/**
 * @openapi
 * /provinces/update-province/{id}:
 *   put:
 *     tags: [Provincias]
 *     summary: Actualizar una provincia
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la provincia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               required:
 *                 - province_name
 *               properties:
 *                   province_name:
 *                       type: string
 *     responses:
 *       200:
 *         description: Provincia actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                      province:
 *                          type: object
 *                          properties:
 *                              id_province:
 *                                  type: number
 *                              province_name:
 *                                  type: string
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Provincia no encontrada
 *       409:
 *         description: La provincia ya existe
 *       500:
 *         description: Error interno del servidor
 */
provincesRouter.put("/update-province/:id", verify_JWT, isAdmin, updateProvinceController);

/**
 * @openapi
 * /provinces/delete-province/{id}:
 *   delete:
 *     tags: [Provincias]
 *     summary: Eliminar una provincia
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la provincia
 *     responses:
 *       200:
 *         description: Provincia eliminada exitosamente
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
 *         description: Provincia no encontrada
 *       409:
 *         description: Existen stores asociados
 *       500:
 *         description: Error interno del servidor
 */
provincesRouter.delete("/delete-province/:id", verify_JWT, isAdmin, deleteProvinceController);

export { provincesRouter };

