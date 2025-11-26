import { Request, Response } from "express";
import { Model } from "sequelize";
import { Users } from "../../models/Users";
import { UsersAttributes, UsersCreationAttributes } from "../../interfaces/users.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const updateUserService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { username, id_user_role, enabled } = req.body;

        if (!id || isNaN(Number(id))) {
            const responseError: ErrorI = {
                error: true,
                message: "ID de usuario inválido",
                statusCode: 400,
            };
            logger.error(`${responseError.message} | status: 400`);
            throw responseError;
        }

        const user: Model<UsersAttributes, UsersCreationAttributes> | null = await Users.findByPk(Number(id));

        if (!user) {
            const responseError: ErrorI = {
                error: true,
                message: "Usuario no encontrado",
                statusCode: 404,
            };
            logger.error(`${responseError.message} | status: 404`);
            throw responseError;
        }

        // Check if username is being changed and if it's already taken
        if (username && username !== user.getDataValue("username")) {
            const existingUser = await Users.findOne({ where: { username } });
            if (existingUser) {
                const responseError: ErrorI = {
                    error: true,
                    message: "El nombre de usuario ya está en uso",
                    statusCode: 409,
                };
                logger.error(`${responseError.message} | status: 409`);
                throw responseError;
            }
        }

        // Update only provided fields
        if (username !== undefined) user.setDataValue("username", username);
        if (id_user_role !== undefined) user.setDataValue("id_user_role", id_user_role);
        if (enabled !== undefined) user.setDataValue("enabled", enabled);

        await user.save();

        return res.status(200).json({
            message: "Usuario actualizado exitosamente",
            user,
        });
    } catch (error: any) {
        if (error.statusCode) {
            throw error;
        }
        const responseError: ErrorI = {
            error: true,
            message: `Error al actualizar usuario: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
