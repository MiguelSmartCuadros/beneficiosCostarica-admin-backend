import { Request, Response, Handler } from "express";
import { getAllTypeshopsService } from "../../services/typeshops/getAllTypeshops.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getAllTypeshopsController: Handler = async (req: Request, res: Response) => {
    try {
        await getAllTypeshopsService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};

