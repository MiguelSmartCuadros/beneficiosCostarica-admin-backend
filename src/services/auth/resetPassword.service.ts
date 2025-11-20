import { Request, Response } from "express";
import { Users } from "../../models/Users";
import { Model } from "sequelize";
import { UsersAttributes, UsersCreationAttributes } from "../../interfaces/users.interface";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const resetPasswordService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const token: string = req.body.token ? req.body.token.toString() : "";
        const new_password: string = req.body.new_password ? req.body.new_password.toString() : "";

        if (!token || !new_password) {
            logger.error("token y new_password son requeridos | status: 400");
            return res.status(400).json({ error: "token y new_password son requeridos" });
        }

        if (!process.env.WORD_SECRET) {
            throw new Error("La variable de entorno WORD_SECRET no esta definida");
        }

        let payload: any;
        try {
            payload = jwt.verify(token, process.env.WORD_SECRET);
        } catch (err: any) {
            const responseError: ErrorI = {
                error: true,
                message: "Token inválido o expirado",
                statusCode: 401,
            };
            return res.status(401).json(responseError);
        }

        if (payload?.purpose !== "password_reset" || !payload?.id_user || !payload?.username) {
            const responseError: ErrorI = {
                error: true,
                message: "Token de reseteo inválido",
                statusCode: 401,
            };
            return res.status(401).json(responseError);
        }

        const user: Model<UsersAttributes, UsersCreationAttributes> | null = await Users.findOne({
            where: { id_user: payload.id_user, username: payload.username },
        });

        if (!user) {
            const responseError: ErrorI = {
                error: true,
                message: "Usuario no encontrado",
                statusCode: 404,
            };
            return res.status(404).json(responseError);
        }

        // Hashear y actualizar la nueva contraseña
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
        const hashedPassword = await bcrypt.hash(new_password, saltRounds);

        await Users.update(
            { password: hashedPassword },
            { where: { id_user: payload.id_user } }
        );

        // Generar nuevo token de inicio de sesión con la nueva contraseña
        const sign_token_options: jwt.SignOptions = {
            expiresIn: process.env.TIME_TOKEN,
        };

        return res.status(200).json({
            message: "Contraseña restablecida exitosamente"
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al restablecer contraseña: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};


