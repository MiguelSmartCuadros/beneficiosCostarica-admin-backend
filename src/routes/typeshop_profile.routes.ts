import { Router } from "express";
import { createTypeshopProfileController } from "../controllers/typeshop_profile/createTypeshopProfile.controller";
import { getAllTypeshopProfilesController } from "../controllers/typeshop_profile/getAllTypeshopProfiles.controller";
import { getTypeshopProfileByIdController } from "../controllers/typeshop_profile/getTypeshopProfileById.controller";
import { updateTypeshopProfileController } from "../controllers/typeshop_profile/updateTypeshopProfile.controller";
import { deleteTypeshopProfileController } from "../controllers/typeshop_profile/deleteTypeshopProfile.controller";
import { verify_JWT } from "../middlewares/verifyToken";
import { isAdmin } from "../middlewares/isAdmin";

const typeshopProfileRouter: Router = Router();

/**
 * @openapi
 * /typeshop-profile/create-typeshop-profile:
 *   post:
 *     tags: [Typeshop Profile]
 *     summary: Crear un nuevo perfil de tipo de tienda
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
 *                 - url_store
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
 *         description: Perfil creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                      typeshopProfile:
 *                          type: object
 *                          properties:
 *                              id_typeshop_profile:
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
typeshopProfileRouter.post("/create-typeshop-profile", verify_JWT, isAdmin, createTypeshopProfileController);

/**
 * @openapi
 * /typeshop-profile/getall-typeshop-profiles:
 *   get:
 *     tags: [Typeshop Profile]
 *     summary: Obtener todos los perfiles de tipo de tienda
 *     security:
 *       - x-access-token: []
 *     responses:
 *       200:
 *         description: Lista de perfiles obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      typeshopProfiles:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id_typeshop_profile:
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
typeshopProfileRouter.get("/getall-typeshop-profiles", verify_JWT, isAdmin, getAllTypeshopProfilesController);

/**
 * @openapi
 * /typeshop-profile/get-typeshop-profile/{id}:
 *   get:
 *     tags: [Typeshop Profile]
 *     summary: Obtener un perfil de tipo de tienda por su ID
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del perfil
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      typeshopProfile:
 *                          type: object
 *                          properties:
 *                              id_typeshop_profile:
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
 *         description: Perfil no encontrado
 *       500:
 *         description: Error interno del servidor
 */
typeshopProfileRouter.get("/get-typeshop-profile/:id", verify_JWT, isAdmin, getTypeshopProfileByIdController);

/**
 * @openapi
 * /typeshop-profile/update-typeshop-profile/{id}:
 *   put:
 *     tags: [Typeshop Profile]
 *     summary: Actualizar un perfil de tipo de tienda
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del perfil
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
 *         description: Perfil actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                      typeshopProfile:
 *                          type: object
 *                          properties:
 *                              id_typeshop_profile:
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
 *         description: Perfil, Store o Typeshop no encontrado
 *       500:
 *         description: Error interno del servidor
 */
typeshopProfileRouter.put("/update-typeshop-profile/:id", verify_JWT, isAdmin, updateTypeshopProfileController);

/**
 * @openapi
 * /typeshop-profile/delete-typeshop-profile/{id}:
 *   delete:
 *     tags: [Typeshop Profile]
 *     summary: Eliminar un perfil de tipo de tienda
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del perfil
 *     responses:
 *       200:
 *         description: Perfil eliminado exitosamente
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
 *         description: Perfil no encontrado
 *       500:
 *         description: Error interno del servidor
 */
typeshopProfileRouter.delete("/delete-typeshop-profile/:id", verify_JWT, isAdmin, deleteTypeshopProfileController);

export { typeshopProfileRouter };
