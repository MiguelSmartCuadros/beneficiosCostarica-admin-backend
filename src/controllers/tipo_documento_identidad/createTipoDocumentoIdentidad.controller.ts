import { Request, Response, Handler } from "express";
import { createTipoDocumentoIdentidadService } from "../../services/tipo_documento_identidad/createTipoDocumentoIdentidad.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const createTipoDocumentoIdentidadController: Handler = async (req: Request, res: Response) => {
    try {
        await createTipoDocumentoIdentidadService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};
