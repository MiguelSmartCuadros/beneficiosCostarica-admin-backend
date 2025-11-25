import { Request, Response } from "express";
import { Model } from "sequelize";
import { UserRoles } from "../../models/UserRoles";
import { UserRolesAttributes, UserRolesCreationAttributes } from "../../interfaces/user_roles.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getAllUserRolesService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const userRoles: Model<UserRolesAttributes, UserRolesCreationAttributes>[] = await UserRoles.findAll({
            order: [["user_role_id", "ASC"]],
        });

        const userRolesData = userRoles.map((userRole) => ({
            user_role_id: userRole.getDataValue("user_role_id"),
            role: userRole.getDataValue("role"),
        }));

        return res.json({
            userRoles: userRolesData,
            total: userRolesData.length,
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener lista de roles de usuario: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

