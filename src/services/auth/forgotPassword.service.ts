import { Request, Response } from "express";
import { Users } from "../../models/Users";
import { Model } from "sequelize";
import { UsersAttributes, UsersCreationAttributes } from "../../interfaces/users.interface";
import jwt from "jsonwebtoken";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";
import { sendPasswordResetEmail } from "../../mail/sender";

export const forgotPasswordService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const username: string = req.body.username ? req.body.username.toString() : "";

        if (!username) {
            logger.error("username es requerido | status: 400");
            return res.status(400).json({ error: "username es requerido" });
        }

        const user: Model<UsersAttributes, UsersCreationAttributes> | null = await Users.findOne({
            where: { username },
        });

        if (!user) {
            logger.error("Usuario no encontrado | status: 404");
            const responseError: ErrorI = {
                error: true,
                message: "Usuario no encontrado",
                statusCode: 404,
            };
            return res.status(404).json(responseError);
        }

        if (!process.env.WORD_SECRET) {
            throw new Error("La variable de entorno WORD_SECRET no esta definida");
        }

        const sign_token_options: jwt.SignOptions = {
            expiresIn: process.env.TIME_RESET_TOKEN || "15m",
        };

        const reset_token = jwt.sign(
            {
                id_user: user.getDataValue("id_user"),
                username: user.getDataValue("username"),
                purpose: "password_reset",
            },
            process.env.WORD_SECRET,
            sign_token_options
        );

        // Enviar email con el token de recuperación y código de verificación
        if (!process.env.EMAIL) {
            throw new Error("La variable de entorno EMAIL no esta definida");
        }

        await sendPasswordResetEmail(
            process.env.EMAIL,
            reset_token,
            user.getDataValue("username"),
        );

        logger.info(`Solicitud de recuperación de contraseña enviada para usuario: ${username}`);

        return res.status(200).json({ 
            requested: true, 
            message: "Se ha enviado un correo electrónico con las instrucciones para restablecer tu contraseña" 
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al solicitar recuperación de contraseña: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};


