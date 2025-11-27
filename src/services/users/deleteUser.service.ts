import { Request, Response } from "express";
import { Users } from "../../models/Users";
import { UserProfile } from "../../models/UserProfile";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";
import { Transaction } from "sequelize";
import { dbConnection } from "../../connections/dbConnection";

export const deleteUserService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    let transaction: Transaction | undefined;
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            const responseError: ErrorI = {
                error: true,
                message: "ID de usuario inválido",
                statusCode: 400,
            };
            logger.error(`${responseError.message} | status: 400`);
            throw responseError;
        }

        const user = await Users.findByPk(Number(id));

        if (!user) {
            const responseError: ErrorI = {
                error: true,
                message: "Usuario no encontrado",
                statusCode: 404,
            };
            logger.error(`${responseError.message} | status: 404`);
            throw responseError;
        }

        // Iniciar transacción
        transaction = await dbConnection.transaction();

        // Primero eliminar el perfil del usuario (si existe)
        await UserProfile.destroy({
            where: { user_id: Number(id) },
            transaction
        });

        // Luego eliminar el usuario
        await user.destroy({ transaction });

        // Confirmar transacción
        await transaction.commit();
        transaction = undefined;

        return res.status(200).json({
            message: "Usuario eliminado exitosamente",
        });
    } catch (error: any) {
        // Revertir transacción en caso de error
        if (transaction) {
            await transaction.rollback();
        }

        if (error.statusCode) {
            throw error;
        }
        const responseError: ErrorI = {
            error: true,
            message: `Error al eliminar usuario: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
