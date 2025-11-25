import { Request, Response, Handler } from "express";
import { deleteTypeshopService } from "../../services/typeshops/deleteTypeshop.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const deleteTypeshopController: Handler = async (req: Request, res: Response) => {
    try {
        await deleteTypeshopService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};

