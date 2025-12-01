import { Request, Response, Handler } from "express";
import { getAllTipoDocumentoIdentidadService } from "../../services/tipo_documento_identidad/getAllTipoDocumentoIdentidad.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getAllTipoDocumentoIdentidadController: Handler = async (req: Request, res: Response) => {
    try {
        await getAllTipoDocumentoIdentidadService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};
