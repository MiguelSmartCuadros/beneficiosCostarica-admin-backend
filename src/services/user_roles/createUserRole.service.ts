import { Request, Response } from "express";
import { UserRoles } from "../../models/UserRoles";
import { Model } from "sequelize";
import { UserRolesAttributes, UserRolesCreationAttributes } from "../../interfaces/user_roles.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const createUserRoleService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { role } = req.body;

        if (!role) {
            logger.error("El campo role es requerido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El campo role es requerido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        // Verificar si el rol ya existe
        const existingRole = await UserRoles.findOne({ where: { role } });
        if (existingRole) {
            logger.error(`El rol ${role} ya existe | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: `El rol ${role} ya existe. Por favor, elige otro nombre.`,
                statusCode: 409,
            };
            return res.status(409).json(responseError);
        }

        const userRole: Model<UserRolesAttributes, UserRolesCreationAttributes> = await UserRoles.create({
            role,
        });

        return res.status(201).json({
            message: "Rol de usuario creado exitosamente",
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
            message: error.message || `Error al crear rol de usuario: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

