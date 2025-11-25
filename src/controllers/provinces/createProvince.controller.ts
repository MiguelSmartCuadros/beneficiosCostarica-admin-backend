import { Request, Response, Handler } from "express";
import { createProvinceService } from "../../services/provinces/createProvince.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const createProvinceController: Handler = async (req: Request, res: Response) => {
    try {
        await createProvinceService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};

