import { Request, Response } from "express";
import { Users } from "../../models/Users";
import { UserProfile } from "../../models/UserProfile";
import { Model } from "sequelize";
import { UsersAttributes, UsersCreationAttributes } from "../../interfaces/users.interface";

import bcrypt from "bcrypt";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const resetPasswordService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const usernameOrEmail: string = req.body.usernameOrEmail ? req.body.usernameOrEmail.toString() : (req.body.username ? req.body.username.toString() : (req.body.email ? req.body.email.toString() : ""));
        const new_password: string = req.body.new_password ? req.body.new_password.toString() : "";
        // Token is now validated in middleware
        // const token: string = req.body.token ? req.body.token.toString() : "";

        if (!usernameOrEmail || !new_password) {
            logger.error("username (o email) y new_password son requeridos | status: 400");
            return res.status(400).json({ error: "username (o email) y new_password son requeridos" });
        }

        const payload = res.locals.resetTokenPayload;

        let user: Model<UsersAttributes, UsersCreationAttributes> | null = null;

        // Check if input is email
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail);

        if (isEmail) {
            // Find user by email via UserProfile
            const userProfile = await UserProfile.findOne({
                where: { email: usernameOrEmail },
                include: [{
                    model: Users,
                    required: true
                }]
            });

            if (userProfile) {
                user = userProfile.getDataValue('user') as Model<UsersAttributes, UsersCreationAttributes>;
            }
        } else {
            // Find user by username
            user = await Users.findOne({
                where: { username: usernameOrEmail },
            });
        }

        if (!user) {
            const responseError: ErrorI = {
                error: true,
                message: "Usuario no encontrado",
                statusCode: 404,
            };
            return res.status(404).json(responseError);
        }

        // Validar que el usuario del token coincida con el usuario encontrado
        if (user.getDataValue("id_user") !== payload.id_user) {
            logger.error(`Intento de cambio de contraseña no autorizado. Token UserID: ${payload.id_user}, Request UserID: ${user.getDataValue("id_user")} | status: 403`);
            const responseError: ErrorI = {
                error: true,
                message: "No tienes permiso para restablecer la contraseña de este usuario.",
                statusCode: 403,
            };
            return res.status(403).json(responseError);
        }

        // Hashear y actualizar la nueva contraseña
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
        const hashedPassword = await bcrypt.hash(new_password, saltRounds);

        await Users.update(
            { password: hashedPassword },
            { where: { id_user: user.getDataValue("id_user") } }
        );

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


