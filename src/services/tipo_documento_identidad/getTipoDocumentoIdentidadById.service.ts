import { Request, Response } from "express";
import { TipoDocumentoIdentidad } from "../../models/TipoDocumentoIdentidad";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getTipoDocumentoIdentidadByIdService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const tipoDocumento = await TipoDocumentoIdentidad.findByPk(id);

        if (!tipoDocumento) {
            const responseError: ErrorI = {
                error: true,
                message: "Tipo de documento no encontrado",
                statusCode: 404,
            };
            logger.error(`${responseError.message} | status: 404`);
            throw responseError;
        }

        return res.json({
            tipoDocumento,
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener tipo de documento: ${error.message || error}`,
            statusCode: error.statusCode || 500,
        };
        logger.error(`${responseError.message} | status: ${responseError.statusCode}`);
        throw responseError;
    }
};
