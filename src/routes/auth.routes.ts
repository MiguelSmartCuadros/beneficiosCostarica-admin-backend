import { Router } from "express";
import { loginController } from "../controllers/auth/login.controller";
import { signupController } from "../controllers/auth/signup.controller";
import { verify_JWT } from "../middlewares/verifyToken";
import { verifyTokenController } from "../controllers/auth/verifyToken.controller";
import { isAdmin } from "../middlewares/isAdmin";
import { forgotPasswordController } from "../controllers/auth/forgotPassword.controller";
import { resetPasswordController } from "../controllers/auth/resetPassword.controller";
import { validateResetToken } from "../middlewares/validateResetToken";

const authRouter: Router = Router();

/**
 * @openapi
 * /auth/verify-token:
 *   get:
 *     tags: [Autenticacion]
 *     summary: Verificar token de un usuario
 *     security:
 *       - x-access-token: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      validToken:
 *                         type: boolean
 *                         description: Indica si el token es válido
 *                      user:
 *                         type: string
 *                         description: Nombre de usuario
 *         headers:
 *             x-access-token:
 *                 description: Token de autenticación de usuario (JWT)
 *                 schema:
 *                     type: string
 *       401:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                          description: Booleano que indica que hubo un error
 *                      message:
 *                          type: string
 *                          description: Descripción del error
 *                      statusCode:
 *                          type: number
 *                          description: Código de error
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                          description: Booleano que indica que hubo un error
 *                      message:
 *                          type: string
 *                          description: Descripción del error
 *                      statusCode:
 *                          type: number
 *                          description: Código de error
 */
authRouter.get("/verify-token", verify_JWT, verifyTokenController);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Autenticacion]
 *     summary: Login de un usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                   username:
 *                       type: string
 *                   password:
 *                       type: string
 *     responses:
 *       200:
 *         description: Usuario logueado con éxito
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      login:
 *                          type: boolean
 *                          description: Indica si el login fue exitoso
 *                      user_role:
 *                          type: string
 *                          description: Rol del usuario
 *         headers:
 *             x-access-token:
 *                 description: Token de autenticación de usuario (JWT)
 *                 schema:
 *                     type: string
 *       400:
 *         description: Datos de entrada inválidos o inexistentes
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                          description: Booleano que indica que hubo un error
 *                      message:
 *                          type: string
 *                          description: Descripción del error
 *                      statusCode:
 *                          type: number
 *                          description: Código de error
 *       401:
 *         description: Password inválida
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                          description: Booleano que indica que hubo un error
 *                      message:
 *                          type: string
 *                          description: Descripción del error
 *                      statusCode:
 *                          type: number
 *                          description: Código de error
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                          description: Booleano que indica que hubo un error
 *                      message:
 *                          type: string
 *                          description: Descripción del error
 *                      statusCode:
 *                          type: number
 *                          description: Código de error
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                          description: Booleano que indica que hubo un error
 *                      message:
 *                          type: string
 *                          description: Descripción del error
 *                      statusCode:
 *                          type: number
 *                          description: Código de error
 */
authRouter.post("/login", loginController);

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     tags: [Autenticacion]
 *     summary: Registro de un usuario
 *     description: Permite registrar un nuevo usuario, esta accion solo la puede realizar un usuario logeado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                   username:
 *                       type: string
 *                   password:
 *                       type: string
 *                   id_user_role:
 *                       type: integer
 *                   email:
 *                       type: string
 *                   nombre_completo:
 *                       type: string
 *                   tipo_documento:
 *                       type: integer
 *                   numero_doc:
 *                       type: string
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito
 *         headers:
 *             x-access-token:
 *                 description: Token de autenticación para el nuevo usuario (JWT)
 *                 schema:
 *                     type: string
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 $ref: '#/components/schemas/users'
 *       400:
 *         description: Datos de entrada inválidos o inexistentes, o error de validación (id_user_role inválido)
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                          description: Booleano que indica que hubo un error
 *                      message:
 *                          type: string
 *                          description: Descripción del error
 *                      statusCode:
 *                          type: number
 *                          description: Código de error
 *       401:
 *         description: Aceso denegado
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                          description: Booleano que indica que hubo un error
 *                      message:
 *                          type: string
 *                          description: Descripción del error
 *                      statusCode:
 *                          type: number
 *                          description: Código de error
 *       409:
 *         description: El username ya está en uso
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                          description: Booleano que indica que hubo un error
 *                      message:
 *                          type: string
 *                          description: Mensaje indicando que el username ya está en uso
 *                      statusCode:
 *                          type: number
 *                          description: Código de error (409)
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      error:
 *                          type: boolean
 *                          description: Booleano que indica que hubo un error
 *                      message:
 *                          type: string
 *                          description: Descripción del error
 *                      statusCode:
 *                          type: number
 *                          description: Código de error
 *     security:
 *      - x-access-token: []
 *
 */
authRouter.post("/signup", verify_JWT, isAdmin, signupController);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags: [Autenticacion]
 *     summary: Solicitar recuperación de contraseña
 *     description: Recibe el username del usuario, genera un token de reseteo de contraseña y envía las instrucciones al correo registrado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               required:
 *                 - username
 *               properties:
 *                 username:
 *                   type: string
 *                   description: Username del usuario que solicita recuperación
 *               example:
 *                 username: "admin"
 *     responses:
 *       200:
 *         description: Solicitud procesada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requested:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 requested: true
 *                 message: "Se ha enviado un correo electrónico con las instrucciones para restablecer tu contraseña"
 *       400:
 *         description: Datos de entrada inválidos o inexistentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 statusCode:
 *                   type: number
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 statusCode:
 *                   type: number
 *               example:
 *                 error: true
 *                 message: "Usuario no encontrado"
 *                 statusCode: 404
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 statusCode:
 *                   type: number
 *               example:
 *                 error: true
 *                 message: "Error al procesar la solicitud"
 *                 statusCode: 500
 */
authRouter.post("/forgot-password", forgotPasswordController);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags: [Autenticacion]
 *     summary: Resetear contraseña
 *     description: Utiliza el token enviado por email junto con la nueva contraseña. Devuelve un nuevo token JWT listo para iniciar sesión.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               required:
 *                 - token
 *                 - new_password
 *               properties:
 *                 usernameOrEmail:
 *                   type: string
 *                   description: Username o Email del usuario (opcional si se envía username o email por separado)
 *                 username:
 *                   type: string
 *                   description: Username del usuario
 *                 email:
 *                   type: string
 *                   description: Email del usuario
 *                 token:
 *                   type: string
 *                   description: Token de recuperación recibido por email
 *                 new_password:
 *                   type: string
 *                   description: Nueva contraseña
 *               example:
 *                 usernameOrEmail: "usuario@example.com"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 new_password: "NuevaPassword123"
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *         headers:
 *           x-access-token:
 *             description: Token de autenticación de usuario (JWT)
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reset:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user_role:
 *                   type: string
 *               example:
 *                 reset: true
 *                 message: "Contraseña restablecida exitosamente"
 *                 user_role: "admin"
 *       400:
 *         description: Datos de entrada inválidos o inexistentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 statusCode:
 *                   type: number
 *       401:
 *         description: Token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 statusCode:
 *                   type: number
 *       404:
 *         description: Usuario o rol no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 statusCode:
 *                   type: number
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 statusCode:
 *                   type: number
 */
authRouter.post("/reset-password", validateResetToken, resetPasswordController);

export { authRouter };