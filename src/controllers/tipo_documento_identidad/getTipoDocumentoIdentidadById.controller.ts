import { Request, Response, Handler } from "express";
import { getTipoDocumentoIdentidadByIdService } from "../../services/tipo_documento_identidad/getTipoDocumentoIdentidadById.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getTipoDocumentoIdentidadByIdController: Handler = async (req: Request, res: Response) => {
    try {
        await getTipoDocumentoIdentidadByIdService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};
