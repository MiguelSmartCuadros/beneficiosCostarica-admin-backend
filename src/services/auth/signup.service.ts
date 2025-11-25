import { Request, Response } from "express";
import { Users } from "../../models/Users";
import { UserProfile } from "../../models/UserProfile";
import { UserRoles } from "../../models/UserRoles";
import { Model, Transaction } from "sequelize";
import { UsersAttributes, UsersCreationAttributes } from "../../interfaces/users.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserProfileCreationAttributes } from "../../interfaces/user_profile.interface";
import { dbConnection } from "../../connections/dbConnection";

export const signupService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    let transaction: Transaction | undefined;
    try {
        const { username, password, id_user_role, email, nombre_completo, tipo_documento, numero_doc } = req.body;

        if (!username || !password || !id_user_role || !email || !nombre_completo || !tipo_documento || !numero_doc) {
            logger.error("Todos los campos son requeridos (username, password, id_user_role, email, nombre_completo, tipo_documento, numero_doc) | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "Todos los campos son requeridos",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        // Verificar que el id_user_role existe
        const existingRole = await UserRoles.findByPk(id_user_role);
        if (!existingRole) {
            logger.error(`El id_user_role ${id_user_role} no existe | status: 400`);
            const responseError: ErrorI = {
                error: true,
                message: `El rol de usuario con id ${id_user_role} no existe. Verifica que el id_user_role sea válido.`,
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

        // Verificar si el email ya existe
        const existingEmail = await UserProfile.findOne({ where: { email } });
        if (existingEmail) {
            logger.error(`El email ${email} ya existe | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: `El email ${email} ya está registrado.`,
                statusCode: 409,
            };
            return res.status(409).json(responseError);
        }

        // Verificar si el número de documento ya existe
        const existingDocument = await UserProfile.findOne({ where: { numero_doc } });
        if (existingDocument) {
            logger.error(`El número de documento ${numero_doc} ya existe | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: `El número de documento ${numero_doc} ya está registrado.`,
                statusCode: 409,
            };
            return res.status(409).json(responseError);
        }

        // Hashear la contraseña del nuevo usuario
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        transaction = await dbConnection.transaction();

        const user: Model<UsersAttributes, UsersCreationAttributes> = await Users.create(
            {
                username,
                password: hashedPassword,
                id_user_role,
                enabled: 1,
            },
            { transaction }
        );

        // Crear el perfil del usuario
        const userProfileData: UserProfileCreationAttributes = {
            user_id: user.getDataValue("id_user"),
            email,
            nombre_completo,
            tipo_documento,
            numero_doc,
        };

        const userProfile = await UserProfile.create(userProfileData, { transaction });

        await transaction.commit();
        transaction = undefined;

        // Obtener el rol del usuario para incluirlo en la respuesta
        const userRole = await UserRoles.findByPk(id_user_role);

        // Generar token JWT para el nuevo usuario
        if (!process.env.WORD_SECRET) {
            throw new Error("La variable de entorno WORD_SECRET no esta definida");
        }

        const sign_token_options: jwt.SignOptions = {
            expiresIn: process.env.TIME_TOKEN,
        };

        const token = jwt.sign(
            {
                id_user: user.getDataValue("id_user"),
                username: user.getDataValue("username"),
                id_user_role: user.getDataValue("id_user_role"),
            },
            process.env.WORD_SECRET,
            sign_token_options
        );

        // Preparar la respuesta con los datos completos del usuario
        const userResponse = {
            id_user: user.getDataValue("id_user"),
            username: user.getDataValue("username"),
            id_user_role: user.getDataValue("id_user_role"),
            enabled: user.getDataValue("enabled"),
            email: userProfile.getDataValue("email"),
            nombre_completo: userProfile.getDataValue("nombre_completo"),
            tipo_documento: userProfile.getDataValue("tipo_documento"),
            numero_doc: userProfile.getDataValue("numero_doc"),
        };

        return res
            .header({
                "Access-Control-Expose-Headers": "x-access-token",
                "x-access-token": token,
            })
            .status(201)
            .json({
                message: "Usuario creado exitosamente",
                user: userResponse,
            });
    } catch (error: any) {
        if (transaction) {
            await transaction.rollback();
        }
        if (error.name === "SequelizeValidationError") {
            logger.error(`Error de validación: ${error.message} | status: 400`);
            const responseError: ErrorI = {
                error: true,
                message: error.message || "Error de validación. Verifica que todos los campos requeridos estén presentes y sean válidos.",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }
        if (error.name === "SequelizeForeignKeyConstraintError") {
            logger.error(`Error de foreign key constraint: ${error.message} | status: 400`);
            const responseError: ErrorI = {
                error: true,
                message: "Error de validación. Verifica que el id_user_role sea válido y exista en la base de datos.",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        // Si el error ya tiene formato ErrorI, retornarlo directamente
        if (error && typeof error === "object" && "error" in error && "message" in error && "statusCode" in error) {
            return res.status(error.statusCode).json(error);
        }

        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al crear usuario: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        return res.status(500).json(responseError);
    }
};

