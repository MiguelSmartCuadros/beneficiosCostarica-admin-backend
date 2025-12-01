import { Request, Response, Handler } from "express";
import { updateTipoDocumentoIdentidadService } from "../../services/tipo_documento_identidad/updateTipoDocumentoIdentidad.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const updateTipoDocumentoIdentidadController: Handler = async (req: Request, res: Response) => {
    try {
        await updateTipoDocumentoIdentidadService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};
