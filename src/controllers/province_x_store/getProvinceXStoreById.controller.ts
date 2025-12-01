import { Request, Response, Handler } from "express";
import { getProvinceXStoreByIdService } from "../../services/province_x_store/getProvinceXStoreById.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getProvinceXStoreByIdController: Handler = async (req: Request, res: Response) => {
    try {
        await getProvinceXStoreByIdService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};
