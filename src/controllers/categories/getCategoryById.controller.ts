import { Request, Response, Handler } from "express";
import { getCategoryByIdService } from "../../services/categories/getCategoryById.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getCategoryByIdController: Handler = async (req: Request, res: Response) => {
    try {
        await getCategoryByIdService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};

