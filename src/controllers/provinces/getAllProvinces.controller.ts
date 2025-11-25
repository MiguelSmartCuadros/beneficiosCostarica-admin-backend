import { Request, Response, Handler } from "express";
import { getAllProvincesService } from "../../services/provinces/getAllProvinces.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getAllProvincesController: Handler = async (req: Request, res: Response) => {
    try {
        await getAllProvincesService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};

