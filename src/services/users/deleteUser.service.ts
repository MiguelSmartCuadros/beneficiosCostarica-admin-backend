import { Request, Response } from "express";
import { Users } from "../../models/Users";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const deleteUserService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
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

        await user.destroy();

        return res.status(200).json({
            message: "Usuario eliminado exitosamente",
        });
    } catch (error: any) {
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
