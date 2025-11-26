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
 *     description: Permite actualizar username, id_user_role y enabled. No incluye cambio de contraseña.
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
 *                       description: Nuevo nombre de usuario
 *                   id_user_role:
 *                       type: number
 *                       description: ID del rol de usuario
 *                   enabled:
 *                       type: number
 *                       description: Estado del usuario (0 = deshabilitado, 1 = habilitado)
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
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: El nombre de usuario ya está en uso
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
