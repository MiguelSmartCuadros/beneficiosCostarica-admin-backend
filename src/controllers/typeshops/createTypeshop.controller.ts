import { Request, Response, Handler } from "express";
import { createTypeshopService } from "../../services/typeshops/createTypeshop.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const createTypeshopController: Handler = async (req: Request, res: Response) => {
    try {
        await createTypeshopService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};

