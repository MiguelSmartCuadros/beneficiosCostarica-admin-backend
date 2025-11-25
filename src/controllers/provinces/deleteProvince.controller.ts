import { Request, Response, Handler } from "express";
import { deleteProvinceService } from "../../services/provinces/deleteProvince.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const deleteProvinceController: Handler = async (req: Request, res: Response) => {
    try {
        await deleteProvinceService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};

