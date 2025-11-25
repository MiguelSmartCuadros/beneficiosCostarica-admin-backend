import { Request, Response } from "express";
import { TipoDocumentoIdentidad } from "../../models/TipoDocumentoIdentidad";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const createTipoDocumentoIdentidadService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { codigo, descripcion } = req.body;

        const exists = await TipoDocumentoIdentidad.findOne({
            where: { codigo },
        });

        if (exists) {
            const responseError: ErrorI = {
                error: true,
                message: "El código de tipo de documento ya existe",
                statusCode: 409,
            };
            logger.error(`${responseError.message} | status: 409`);
            throw responseError;
        }

        const newTipoDocumento = await TipoDocumentoIdentidad.create({
            codigo,
            descripcion,
        });

        return res.status(201).json({
            message: "Tipo de documento creado exitosamente",
            tipoDocumento: newTipoDocumento,
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al crear tipo de documento: ${error.message || error}`,
            statusCode: error.statusCode || 500,
        };
        logger.error(`${responseError.message} | status: ${responseError.statusCode}`);
        throw responseError;
    }
};
