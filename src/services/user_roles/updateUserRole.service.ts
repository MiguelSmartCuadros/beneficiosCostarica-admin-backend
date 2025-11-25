import { Request, Response } from "express";
import { Model, Op } from "sequelize";
import { UserRoles } from "../../models/UserRoles";
import { UserRolesAttributes, UserRolesCreationAttributes } from "../../interfaces/user_roles.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const updateUserRoleService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user_role_id = Number(id);
        const { role } = req.body;

        if (!user_role_id || isNaN(user_role_id)) {
            logger.error("El ID de rol de usuario debe ser un número válido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El ID de rol de usuario debe ser un número válido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        if (!role) {
            logger.error("El campo role es requerido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El campo role es requerido",
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

        // Verificar si el nuevo nombre de rol ya existe en otro rol
        const existingRole = await UserRoles.findOne({
            where: {
                role,
                user_role_id: { [Op.ne]: user_role_id },
            },
        });

        if (existingRole) {
            logger.error(`El rol ${role} ya existe | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: `El rol ${role} ya existe. Por favor, elige otro nombre.`,
                statusCode: 409,
            };
            return res.status(409).json(responseError);
        }

        await userRole.update({ role });

        return res.json({
            message: "Rol de usuario actualizado exitosamente",
            userRole: {
                user_role_id: userRole.getDataValue("user_role_id"),
                role: userRole.getDataValue("role"),
            },
        });
    } catch (error: any) {
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            logger.error(`Error de validación: ${error.message} | status: 400`);
            const responseError: ErrorI = {
                error: true,
                message: error.message || "Error de validación. Verifica que todos los campos requeridos estén presentes.",
                statusCode: 400,
            };
            throw responseError;
        }

        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al actualizar rol de usuario: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

