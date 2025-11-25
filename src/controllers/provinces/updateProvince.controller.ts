import { Request, Response, Handler } from "express";
import { updateProvinceService } from "../../services/provinces/updateProvince.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const updateProvinceController: Handler = async (req: Request, res: Response) => {
    try {
        await updateProvinceService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};

