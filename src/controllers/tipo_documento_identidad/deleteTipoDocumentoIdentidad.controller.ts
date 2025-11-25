import { Request, Response, Handler } from "express";
import { deleteTipoDocumentoIdentidadService } from "../../services/tipo_documento_identidad/deleteTipoDocumentoIdentidad.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const deleteTipoDocumentoIdentidadController: Handler = async (req: Request, res: Response) => {
    try {
        await deleteTipoDocumentoIdentidadService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};
