import { Request, Response, Handler } from "express";
import { updateTypeshopService } from "../../services/typeshops/updateTypeshop.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const updateTypeshopController: Handler = async (req: Request, res: Response) => {
    try {
        await updateTypeshopService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};

