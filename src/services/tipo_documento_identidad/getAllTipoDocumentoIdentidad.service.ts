import { Request, Response } from "express";
import { Model } from "sequelize";
import { TipoDocumentoIdentidad } from "../../models/TipoDocumentoIdentidad";
import { TipoDocumentoIdentidadAttributes, TipoDocumentoIdentidadCreationAttributes } from "../../interfaces/tipo_documento_identidad.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getAllTipoDocumentoIdentidadService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const tiposDocumento: Model<TipoDocumentoIdentidadAttributes, TipoDocumentoIdentidadCreationAttributes>[] = await TipoDocumentoIdentidad.findAll({
            order: [["id", "ASC"]],
        });

        return res.json({
            tiposDocumento,
            total: tiposDocumento.length,
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener lista de tipos de documento: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
