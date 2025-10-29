import { Request, Response } from "express";
import { Model } from "sequelize";
import { Users } from "../../models/Users";
import { UsersAttributes, UsersCreationAttributes } from "../../interfaces/users.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getAllUsersService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const users: Model<UsersAttributes, UsersCreationAttributes>[] = await Users.findAll();

        return res.json({ users });
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
