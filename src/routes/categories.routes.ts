import { Router } from "express";
import { createCategoryController } from "../controllers/categories/createCategory.controller";
import { getAllCategoriesController } from "../controllers/categories/getAllCategories.controller";
import { getCategoryByIdController } from "../controllers/categories/getCategoryById.controller";
import { updateCategoryController } from "../controllers/categories/updateCategory.controller";
import { deleteCategoryController } from "../controllers/categories/deleteCategory.controller";
import { verify_JWT } from "../middlewares/verifyToken";
import { isAdmin } from "../middlewares/isAdmin";

const categoriesRouter: Router = Router();

/**
 * @openapi
 * /categories:
 *   post:
 *     tags: [Categorias]
 *     summary: Crear una nueva categoría
 *     security:
 *       - x-access-token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               required:
 *                 - name_category
 *               properties:
 *                   name_category:
 *                       type: string
 *                       description: Nombre de la categoría
 *                       example: "Restaurantes"
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                          description: Mensaje de éxito
 *                      category:
 *                          type: object
 *                          properties:
 *                              id_category:
 *                                  type: number
 *                              name_category:
 *                                  type: string
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                      message:
 *                          type: string
 *                      statusCode:
 *                          type: number
 *       409:
 *         description: La categoría ya existe
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                      message:
 *                          type: string
 *                      statusCode:
 *                          type: number
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                      message:
 *                          type: string
 *                      statusCode:
 *                          type: number
 */
categoriesRouter.post("/create-category", verify_JWT, isAdmin, createCategoryController);

/**
 * @openapi
 * /categories:
 *   get:
 *     tags: [Categorias]
 *     summary: Obtener todas las categorías
 *     security:
 *       - x-access-token: []
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      categories:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id_category:
 *                                      type: number
 *                                  name_category:
 *                                      type: string
 *                      total:
 *                          type: number
 *                          description: Total de categorías
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                      message:
 *                          type: string
 *                      statusCode:
 *                          type: number
 */
categoriesRouter.get("/getall-categories", verify_JWT, isAdmin, getAllCategoriesController);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     tags: [Categorias]
 *     summary: Obtener una categoría por su ID
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      category:
 *                          type: object
 *                          properties:
 *                              id_category:
 *                                  type: number
 *                              name_category:
 *                                  type: string
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                      message:
 *                          type: string
 *                      statusCode:
 *                          type: number
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                      message:
 *                          type: string
 *                      statusCode:
 *                          type: number
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                      message:
 *                          type: string
 *                      statusCode:
 *                          type: number
 */
categoriesRouter.get("/get-category/:id", verify_JWT, isAdmin, getCategoryByIdController);

/**
 * @openapi
 * /categories/{id}:
 *   put:
 *     tags: [Categorias]
 *     summary: Actualizar una categoría
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               required:
 *                 - name_category
 *               properties:
 *                   name_category:
 *                       type: string
 *                       description: Nuevo nombre de la categoría
 *                       example: "Restaurantes Premium"
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                      category:
 *                          type: object
 *                          properties:
 *                              id_category:
 *                                  type: number
 *                              name_category:
 *                                  type: string
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                      message:
 *                          type: string
 *                      statusCode:
 *                          type: number
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                      message:
 *                          type: string
 *                      statusCode:
 *                          type: number
 *       409:
 *         description: El nombre de categoría ya existe
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                      message:
 *                          type: string
 *                      statusCode:
 *                          type: number
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                      message:
 *                          type: string
 *                      statusCode:
 *                          type: number
 */
categoriesRouter.put("/update-category/:id", verify_JWT, isAdmin, updateCategoryController);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     tags: [Categorias]
 *     summary: Eliminar una categoría
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                      message:
 *                          type: string
 *                      statusCode:
 *                          type: number
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                      message:
 *                          type: string
 *                      statusCode:
 *                          type: number
 *       409:
 *         description: No se puede eliminar la categoría porque tiene stores asociados
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                      message:
 *                          type: string
 *                      statusCode:
 *                          type: number
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                      message:
 *                          type: string
 *                      statusCode:
 *                          type: number
 */
categoriesRouter.delete("/delete-category/:id", verify_JWT, isAdmin, deleteCategoryController);

export { categoriesRouter };

