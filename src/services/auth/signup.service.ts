import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Users } from "../../models/Users";
import { Model } from "sequelize";
import { UsersAttributes, UsersCreationAttributes } from "../../interfaces/users.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";
import bcrypt from "bcrypt";

    export const signupService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { username, password, id_user_role } = req.body;

        if (!username || !password || !id_user_role) {
        logger.error("username, password e id_user_role son requeridos | status: 400");
        return res.status(400).json({ error: "username, password e id_user_role son requeridos" });
        }

        // Hashear la contraseña del nuevo usuario
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user: Model<UsersAttributes, UsersCreationAttributes> = await Users.create({
        username,
        password: hashedPassword,
        id_user_role,
        });

        const userData: UsersAttributes = user.get();

        if (!process.env.WORD_SECRET) {
        throw new Error("La variable de entorno WORD_SECRET no esta definida");
        }

        const token = jwt.sign(
        {
            id_user: user.getDataValue("id_user"),
            username: user.getDataValue("username"),
            id_user_role: user.getDataValue("id_user_role"),
        },
        process.env.WORD_SECRET
        );

        return res.header("x-access-token", token).status(201).json(userData);
    } catch (error: any) {
        const responseError: ErrorI = {
        error: true,
        message: error.message || `Error al crear usuario: ${error}`,
        statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
    };

    