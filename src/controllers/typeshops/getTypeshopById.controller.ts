import { Request, Response, Handler } from "express";
import { getTypeshopByIdService } from "../../services/typeshops/getTypeshopById.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getTypeshopByIdController: Handler = async (req: Request, res: Response) => {
    try {
        await getTypeshopByIdService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};

