import { Request, Response, Handler } from "express";
import { getProvinceByIdService } from "../../services/provinces/getProvinceById.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getProvinceByIdController: Handler = async (req: Request, res: Response) => {
    try {
        await getProvinceByIdService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};

