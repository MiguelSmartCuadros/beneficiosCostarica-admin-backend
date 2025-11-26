import { NextFunction, Request, Response } from "express";
import { logger } from "../logger/logger";
import { ErrorI } from "../interfaces/error.interface";
import { Model } from "sequelize";
import { UserRolesAttributes, UserRolesCreationAttributes } from "../interfaces/user_roles.interface";
import { UserRoles } from "../models/UserRoles";
import { JwtPayload } from "../interfaces/jwt.interface";

export const isAdmin: (req: Request, res: Response, next: NextFunction) => void = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_roles: Model<UserRolesAttributes, UserRolesCreationAttributes>[] = await UserRoles.findAll();

        const role_id: number = req.user_data.id_user_role;
        const role_string: string = (user_roles.find(user_role => user_role.getDataValue("user_role_id") === role_id)?.getDataValue("role") as string) || "";

        if (role_string !== "ROLE_ADMIN") {
            logger.error("Acceso denegado, el usuario no tiene privilegios de administrador | status: 401");
            const responseError: ErrorI = { error: true, message: "Acceso denegado. Debes tener privilegios de administrador para realizar esta acción", statusCode: 401 };
            return res.status(401).json(responseError);
        }
        next();
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error.message + " | status: 500");
            const responseError: ErrorI = { error: true, message: error.message, statusCode: 500 };
            res.status(500).json(responseError);
        } else {
            logger.error(error + " | status: 500");
            const responseError: ErrorI = { error: true, message: "Error al comprobar si el usaurio es administrador", statusCode: 500 };
            res.status(500).json(responseError);
        }
    }
};