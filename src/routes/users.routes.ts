import { Router } from "express";
import { getAllUsersController } from "../controllers/users/getAllUsers.controller";
import { getUserByIdController } from "../controllers/users/getUserById.controller";
import { updateUserController } from "../controllers/users/updateUser.controller";
import { deleteUserController } from "../controllers/users/deleteUser.controller";
import { verify_JWT } from "../middlewares/verifyToken";
import { isAdmin } from "../middlewares/isAdmin";

const usersRouter: Router = Router();

/**
 * @openapi
 * /users/getall-users:
 *   get:
 *     tags: [Users]
 *     summary: Obtener todos los usuarios
 *     security:
 *       - x-access-token: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      users:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id_user:
 *                                      type: number
 *                                  username:
 *                                      type: string
 *                                  id_user_role:
 *                                      type: number
 *                                  enabled:
 *                                      type: number
 *       500:
 *         description: Error interno del servidor
 */
usersRouter.get("/getall-users", verify_JWT, isAdmin, getAllUsersController);

/**
 * @openapi
 * /users/get-user/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtener un usuario por su ID
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      user:
 *                          type: object
 *                          properties:
 *                              id_user:
 *                                  type: number
 *                              username:
 *                                  type: string
 *                              id_user_role:
 *                                  type: number
 *                              enabled:
 *                                  type: number
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
usersRouter.get("/get-user/:id", verify_JWT, isAdmin, getUserByIdController);

/**
 * @openapi
 * /users/update-user/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Actualizar un usuario
 *     description: Permite actualizar cualquier campo del usuario (tabla users) y su perfil (tabla user_profile). Todos los campos son opcionales. Solo los campos proporcionados serán actualizados.
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                   username:
 *                       type: string
 *                       description: Nombre de usuario (debe ser único)
 *                   id_user_role:
 *                       type: number
 *                       description: ID del rol de usuario
 *                   enabled:
 *                       type: number
 *                       description: Estado del usuario (0 = deshabilitado, 1 = habilitado)
 *                   tipo_documento:
 *                       type: number
 *                       description: ID del tipo de documento de identidad
 *                   numero_doc:
 *                       type: string
 *                       description: Número de documento de identidad (debe ser único)
 *                   nombre_completo:
 *                       type: string
 *                       description: Nombre completo del usuario
 *                   email:
 *                       type: string
 *                       description: Email del usuario (debe ser único)
 *               example:
 *                   username: "usuario123"
 *                   id_user_role: 2
 *                   enabled: 1
 *                   tipo_documento: 1
 *                   numero_doc: "123456789"
 *                   nombre_completo: "Juan Pérez González"
 *                   email: "juan.perez@example.com"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                          example: "Usuario actualizado exitosamente"
 *                      user:
 *                          type: object
 *                          properties:
 *                              id_user:
 *                                  type: number
 *                              username:
 *                                  type: string
 *                              id_user_role:
 *                                  type: number
 *                              enabled:
 *                                  type: number
 *                              user_profile:
 *                                  type: object
 *                                  properties:
 *                                      id:
 *                                          type: number
 *                                      tipo_documento:
 *                                          type: number
 *                                      numero_doc:
 *                                          type: string
 *                                      nombre_completo:
 *                                          type: string
 *                                      email:
 *                                          type: string
 *                                      user_id:
 *                                          type: number
 *       400:
 *         description: ID de usuario inválido
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: Username, email o número de documento ya está en uso
 *       500:
 *         description: Error interno del servidor
 */
usersRouter.put("/update-user/:id", verify_JWT, isAdmin, updateUserController);

/**
 * @openapi
 * /users/delete-user/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Eliminar un usuario
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
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
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
usersRouter.delete("/delete-user/:id", verify_JWT, isAdmin, deleteUserController);

export { usersRouter };

