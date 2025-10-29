import { Model } from "sequelize";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";
import { UserRolesAttributes, UserRolesCreationAttributes } from "../../interfaces/user_roles.interface";
import { UserRoles } from "../../models/UserRoles";

export const getAllUsersRolesService: () => Promise<Model<UserRolesAttributes, UserRolesCreationAttributes>[]> = async () => {
    try {
        const roles: Model<UserRolesAttributes, UserRolesCreationAttributes>[] = await UserRoles.findAll();
        return roles;
    } catch (error: any) {
        const responseError: ErrorI = {
        error: true,
        message: `Error al obtener lista de usuarios: ${error.message || error}`,
        statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
