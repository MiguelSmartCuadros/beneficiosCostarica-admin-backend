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
        const responseError: ErrorI = {
            error: true,
            message: "username, password e id_user_role son requeridos",
            statusCode: 400,
        };
        return res.status(400).json(responseError);
        }

        // Verificar si el username ya existe
        const existingUser = await Users.findOne({ where: { username } });
        if (existingUser) {
            logger.error(`El username ${username} ya existe | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: `El username ${username} ya está en uso. Por favor, elige otro username.`,
                statusCode: 409,
            };
            return res.status(409).json(responseError);
        }

        // Hashear la contraseña del nuevo usuario
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user: Model<UsersAttributes, UsersCreationAttributes> = await Users.create({
        username,
        password: hashedPassword,
        id_user_role,
        enabled: 1,
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
        // Manejar errores de validación de Sequelize
        if (error.name === "SequelizeUniqueConstraintError") {
            logger.error(`El username ya existe | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: `El username ya está en uso. Por favor, elige otro username.`,
                statusCode: 409,
            };
            throw responseError;
        }
        
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeForeignKeyConstraintError") {
            logger.error(`Error de validación: ${error.message} | status: 400`);
            const responseError: ErrorI = {
                error: true,
                message: error.message || "Error de validación. Verifica que el id_user_role sea válido y que todos los campos requeridos estén presentes.",
                statusCode: 400,
            };
            throw responseError;
        }

        const responseError: ErrorI = {
        error: true,
        message: error.message || `Error al crear usuario: ${error}`,
        statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
    };

    