import { Request, Response } from "express";
import { Users } from "../../models/Users";
import { UserProfile } from "../../models/UserProfile";
import { Model, Transaction } from "sequelize";
import { UsersAttributes, UsersCreationAttributes } from "../../interfaces/users.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";
import bcrypt from "bcrypt";
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

        await UserProfile.create(userProfileData, { transaction });

        await transaction.commit();
        transaction = undefined;

        return res.status(201).json({
            message: "Usuario creado exitosamente"
        });
    } catch (error: any) {
        if (transaction) {
            await transaction.rollback();
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

