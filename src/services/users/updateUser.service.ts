import { Request, Response } from "express";
import { Model } from "sequelize";
import { Users } from "../../models/Users";
import { UserProfile } from "../../models/UserProfile";
import { UsersAttributes, UsersCreationAttributes } from "../../interfaces/users.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const updateUserService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            username,
            id_user_role,
            enabled,
            // Campos de UserProfile
            tipo_documento,
            numero_doc,
            nombre_completo,
            email
        } = req.body;

        if (!id || isNaN(Number(id))) {
            const responseError: ErrorI = {
                error: true,
                message: "ID de usuario inválido",
                statusCode: 400,
            };
            logger.error(`${responseError.message} | status: 400`);
            throw responseError;
        }

        const user: Model<UsersAttributes, UsersCreationAttributes> | null = await Users.findByPk(Number(id), {
            include: [
                {
                    model: UserProfile,
                    required: false,
                }
            ]
        });

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

        // Check if email is being changed and if it's already taken
        if (email) {
            const existingProfile = await UserProfile.findOne({
                where: { email },
            });
            if (existingProfile && existingProfile.getDataValue("user_id") !== Number(id)) {
                const responseError: ErrorI = {
                    error: true,
                    message: "El email ya está en uso",
                    statusCode: 409,
                };
                logger.error(`${responseError.message} | status: 409`);
                throw responseError;
            }
        }

        // Update Users fields
        if (username !== undefined) user.setDataValue("username", username);
        if (id_user_role !== undefined) user.setDataValue("id_user_role", id_user_role);
        if (enabled !== undefined) user.setDataValue("enabled", enabled);

        await user.save();

        // Update UserProfile fields if they exist
        const userData: any = user.toJSON();
        if (userData.user_profile) {
            const userProfile = await UserProfile.findOne({ where: { user_id: Number(id) } });
            if (userProfile) {
                if (tipo_documento !== undefined) userProfile.setDataValue("tipo_documento", tipo_documento);
                if (numero_doc !== undefined) userProfile.setDataValue("numero_doc", numero_doc);
                if (nombre_completo !== undefined) userProfile.setDataValue("nombre_completo", nombre_completo);
                if (email !== undefined) userProfile.setDataValue("email", email);

                await userProfile.save();
            }
        }

        // Fetch updated user with profile
        const updatedUser = await Users.findByPk(Number(id), {
            include: [
                {
                    model: UserProfile,
                    required: false,
                }
            ]
        });

        return res.status(200).json({
            message: "Usuario actualizado exitosamente",
            user: updatedUser,
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
