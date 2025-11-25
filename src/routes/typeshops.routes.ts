import { Router } from "express";
import { createTypeshopController } from "../controllers/typeshops/createTypeshop.controller";
import { getAllTypeshopsController } from "../controllers/typeshops/getAllTypeshops.controller";
import { getTypeshopByIdController } from "../controllers/typeshops/getTypeshopById.controller";
import { updateTypeshopController } from "../controllers/typeshops/updateTypeshop.controller";
import { deleteTypeshopController } from "../controllers/typeshops/deleteTypeshop.controller";
import { verify_JWT } from "../middlewares/verifyToken";
import { isAdmin } from "../middlewares/isAdmin";

const typeshopsRouter: Router = Router();

/**
 * @openapi
 * /typeshops/create-typeshop:
 *   post:
 *     tags: [Typeshops]
 *     summary: Crear un nuevo tipo de tienda
 *     security:
 *       - x-access-token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               required:
 *                 - shop_type_name
 *               properties:
 *                   shop_type_name:
 *                       type: string
 *                       description: Nombre del tipo de tienda
 *                       example: "Restaurantes"
 *     responses:
 *       201:
 *         description: Tipo de tienda creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                      typeshop:
 *                          type: object
 *                          properties:
 *                              id_type_shop:
 *                                  type: number
 *                              shop_type_name:
 *                                  type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: El tipo de tienda ya existe
 *       500:
 *         description: Error interno del servidor
 */
typeshopsRouter.post("/create-typeshop", verify_JWT, isAdmin, createTypeshopController);

/**
 * @openapi
 * /typeshops/getall-typeshops:
 *   get:
 *     tags: [Typeshops]
 *     summary: Obtener todos los tipos de tienda
 *     security:
 *       - x-access-token: []
 *     responses:
 *       200:
 *         description: Lista de tipos de tienda obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      typeshops:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id_type_shop:
 *                                      type: number
 *                                  shop_type_name:
 *                                      type: string
 *                      total:
 *                          type: number
 *       500:
 *         description: Error interno del servidor
 */
typeshopsRouter.get("/getall-typeshops", verify_JWT, isAdmin, getAllTypeshopsController);

/**
 * @openapi
 * /typeshops/get-typeshop/{id}:
 *   get:
 *     tags: [Typeshops]
 *     summary: Obtener un tipo de tienda por su ID
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de tienda
 *     responses:
 *       200:
 *         description: Tipo de tienda obtenido exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Tipo de tienda no encontrado
 *       500:
 *         description: Error interno del servidor
 */
typeshopsRouter.get("/get-typeshop/:id", verify_JWT, isAdmin, getTypeshopByIdController);

/**
 * @openapi
 * /typeshops/update-typeshop/{id}:
 *   put:
 *     tags: [Typeshops]
 *     summary: Actualizar un tipo de tienda
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de tienda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               required:
 *                 - shop_type_name
 *               properties:
 *                   shop_type_name:
 *                       type: string
 *     responses:
 *       200:
 *         description: Tipo de tienda actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Tipo de tienda no encontrado
 *       409:
 *         description: El nombre ya existe
 *       500:
 *         description: Error interno del servidor
 */
typeshopsRouter.put("/update-typeshop/:id", verify_JWT, isAdmin, updateTypeshopController);

/**
 * @openapi
 * /typeshops/delete-typeshop/{id}:
 *   delete:
 *     tags: [Typeshops]
 *     summary: Eliminar un tipo de tienda
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de tienda
 *     responses:
 *       200:
 *         description: Tipo de tienda eliminado exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Tipo de tienda no encontrado
 *       409:
 *         description: Existen stores asociados
 *       500:
 *         description: Error interno del servidor
 */
typeshopsRouter.delete("/delete-typeshop/:id", verify_JWT, isAdmin, deleteTypeshopController);

export { typeshopsRouter };

