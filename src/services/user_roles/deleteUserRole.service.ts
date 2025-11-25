import { Request, Response } from "express";
import { Model } from "sequelize";
import { UserRoles } from "../../models/UserRoles";
import { UserRolesAttributes, UserRolesCreationAttributes } from "../../interfaces/user_roles.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";
import { Users } from "../../models/Users";

export const deleteUserRoleService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
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

        // Verificar si hay usuarios asociados a este rol
        const usersCount = await Users.count({
            where: {
                id_user_role: user_role_id,
            },
        });

        if (usersCount > 0) {
            logger.error(`No se puede eliminar el rol porque tiene ${usersCount} usuario(s) asociado(s) | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: `No se puede eliminar el rol porque tiene ${usersCount} usuario(s) asociado(s). Elimina o actualiza los usuarios primero.`,
                statusCode: 409,
            };
            return res.status(409).json(responseError);
        }

        await userRole.destroy();

        return res.json({
            message: "Rol de usuario eliminado exitosamente",
        });
    } catch (error: any) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            logger.error(`Error de restricción de clave foránea: ${error.message} | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: "No se puede eliminar el rol porque tiene usuarios asociados. Elimina o actualiza los usuarios primero.",
                statusCode: 409,
            };
            throw responseError;
        }

        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al eliminar rol de usuario: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

