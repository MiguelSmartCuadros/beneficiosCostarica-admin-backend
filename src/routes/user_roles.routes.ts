import { Router } from "express";
import { createUserRoleController } from "../controllers/user_roles/createUserRole.controller";
import { getAllUserRolesController } from "../controllers/user_roles/getAllUserRoles.controller";
import { getUserRoleByIdController } from "../controllers/user_roles/getUserRoleById.controller";
import { updateUserRoleController } from "../controllers/user_roles/updateUserRole.controller";
import { deleteUserRoleController } from "../controllers/user_roles/deleteUserRole.controller";
import { verify_JWT } from "../middlewares/verifyToken";
import { isAdmin } from "../middlewares/isAdmin";

const userRolesRouter: Router = Router();

/**
 * @openapi
 * /user-roles/create-user-role:
 *   post:
 *     tags: [Roles de Usuario]
 *     summary: Crear un nuevo rol de usuario
 *     security:
 *       - x-access-token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               required:
 *                 - role
 *               properties:
 *                   role:
 *                       type: string
 *                       description: Nombre del rol de usuario
 *                       example: "ROLE_ADMIN"
 *     responses:
 *       201:
 *         description: Rol de usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                          description: Mensaje de éxito
 *                      userRole:
 *                          type: object
 *                          properties:
 *                              user_role_id:
 *                                  type: number
 *                              role:
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
 *         description: El rol ya existe
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
userRolesRouter.post("/create-user-role", verify_JWT, isAdmin, createUserRoleController);

/**
 * @openapi
 * /user-roles/getall-user-roles:
 *   get:
 *     tags: [Roles de Usuario]
 *     summary: Obtener todos los roles de usuario
 *     security:
 *       - x-access-token: []
 *     responses:
 *       200:
 *         description: Lista de roles de usuario obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      userRoles:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  user_role_id:
 *                                      type: number
 *                                  role:
 *                                      type: string
 *                      total:
 *                          type: number
 *                          description: Total de roles de usuario
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
userRolesRouter.get("/getall-user-roles", verify_JWT, isAdmin, getAllUserRolesController);

/**
 * @openapi
 * /user-roles/get-user-role/{id}:
 *   get:
 *     tags: [Roles de Usuario]
 *     summary: Obtener un rol de usuario por su ID
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol de usuario
 *     responses:
 *       200:
 *         description: Rol de usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      userRole:
 *                          type: object
 *                          properties:
 *                              user_role_id:
 *                                  type: number
 *                              role:
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
 *         description: Rol de usuario no encontrado
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
userRolesRouter.get("/get-user-role/:id", verify_JWT, isAdmin, getUserRoleByIdController);

/**
 * @openapi
 * /user-roles/update-user-role/{id}:
 *   put:
 *     tags: [Roles de Usuario]
 *     summary: Actualizar un rol de usuario
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               required:
 *                 - role
 *               properties:
 *                   role:
 *                       type: string
 *                       description: Nuevo nombre del rol de usuario
 *                       example: "ROLE_ADMIN"
 *     responses:
 *       200:
 *         description: Rol de usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      message:
 *                          type: string
 *                      userRole:
 *                          type: object
 *                          properties:
 *                              user_role_id:
 *                                  type: number
 *                              role:
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
 *         description: Rol de usuario no encontrado
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
 *         description: El nombre de rol ya existe
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
userRolesRouter.put("/update-user-role/:id", verify_JWT, isAdmin, updateUserRoleController);

/**
 * @openapi
 * /user-roles/delete-user-role/{id}:
 *   delete:
 *     tags: [Roles de Usuario]
 *     summary: Eliminar un rol de usuario
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol de usuario
 *     responses:
 *       200:
 *         description: Rol de usuario eliminado exitosamente
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
 *         description: Rol de usuario no encontrado
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
 *         description: No se puede eliminar el rol porque tiene usuarios asociados
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
userRolesRouter.delete("/delete-user-role/:id", verify_JWT, isAdmin, deleteUserRoleController);

export { userRolesRouter };

