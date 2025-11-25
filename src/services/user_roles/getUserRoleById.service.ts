import { Request, Response } from "express";
import { Model } from "sequelize";
import { UserRoles } from "../../models/UserRoles";
import { UserRolesAttributes, UserRolesCreationAttributes } from "../../interfaces/user_roles.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getUserRoleByIdService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user_role_id = Number(id);

        if (!user_role_id || isNaN(user_role_id)) {
            logger.error("El ID de rol de usuario debe ser un número válido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El ID de rol de usuario debe ser un número válido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        const userRole: Model<UserRolesAttributes, UserRolesCreationAttributes> | null = await UserRoles.findByPk(user_role_id);

        if (!userRole) {
            logger.error(`Rol de usuario con ID ${user_role_id} no encontrado | status: 404`);
            const responseError: ErrorI = {
                error: true,
                message: `Rol de usuario con ID ${user_role_id} no encontrado`,
                statusCode: 404,
            };
            return res.status(404).json(responseError);
        }

        return res.json({
            userRole: {
                user_role_id: userRole.getDataValue("user_role_id"),
                role: userRole.getDataValue("role"),
            },
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener rol de usuario: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

