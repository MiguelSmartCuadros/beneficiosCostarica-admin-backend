import { Router } from "express";
import { loginController } from "../controllers/auth/login.controller";
import { signupController } from "../controllers/auth/signup.controller";
import { verify_JWT } from "../middlewares/verifyToken";
import { verifyTokenController } from "../controllers/auth/verifyToken.controller";
import { isAdmin } from "../middlewares/isAdmin";
import { forgotPasswordController } from "../controllers/auth/forgotPassword.controller";
import { resetPasswordController } from "../controllers/auth/resetPassword.controller";

const authRouter: Router = Router();

/**
 * @openapi
 * /auth/verify-token:
 *   get:
 *     tags: [Autenticacion]
 *     summary: Verificar token de un usuario
 *     security:
 *     - x-access-token: []
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
 *     responses:
 *       200:
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
 *     summary: Solicitar recuperación de contraseña
 *     description: Genera un token temporal para restablecer la contraseña del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                   username:
 *                       type: string
 *     responses:
 *       200:
 *         description: Solicitud procesada con éxito
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      requested:
 *                          type: boolean
 *                      reset_token:
 *                          type: string
 *                          description: Token temporal para restablecer la contraseña
 *       400:
 *         description: Datos de entrada inválidos o inexistentes
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
 *         description: Usuario no encontrado
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
 *         description: Error interno
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
authRouter.post("/forgot-password", forgotPasswordController);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags: [Autenticacion]
 *     summary: Confirmar reseteo de contraseña
 *     description: Valida el token de reseteo y actualiza la contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                   token:
 *                       type: string
 *                   new_password:
 *                       type: string
 *     responses:
 *       200:
 *         description: Contraseña restablecida con éxito
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      reset:
 *                          type: boolean
 *       400:
 *         description: Datos de entrada inválidos o inexistentes
 *       401:
 *         description: Token inválido o expirado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
authRouter.post("/reset-password", resetPasswordController);



export { authRouter };