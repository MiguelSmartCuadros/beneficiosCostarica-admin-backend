import { Request, Response } from "express";
import { TipoDocumentoIdentidad } from "../../models/TipoDocumentoIdentidad";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const updateTipoDocumentoIdentidadService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { codigo, descripcion } = req.body;

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

        if (codigo) {
            const exists = await TipoDocumentoIdentidad.findOne({
                where: { codigo },
            });

            if (exists && exists.getDataValue("id") !== parseInt(id)) {
                const responseError: ErrorI = {
                    error: true,
                    message: "El código de tipo de documento ya existe",
                    statusCode: 409,
                };
                logger.error(`${responseError.message} | status: 409`);
                throw responseError;
            }
        }

        await tipoDocumento.update({
            codigo,
            descripcion,
        });

        return res.json({
            message: "Tipo de documento actualizado exitosamente",
            tipoDocumento,
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al actualizar tipo de documento: ${error.message || error}`,
            statusCode: error.statusCode || 500,
        };
        logger.error(`${responseError.message} | status: ${responseError.statusCode}`);
        throw responseError;
    }
};
