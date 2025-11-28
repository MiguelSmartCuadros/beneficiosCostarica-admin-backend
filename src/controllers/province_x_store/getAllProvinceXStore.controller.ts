import { Request, Response, Handler } from "express";
import { getAllProvinceXStoreService } from "../../services/province_x_store/getAllProvinceXStore.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getAllProvinceXStoreController: Handler = async (req: Request, res: Response) => {
    try {
        await getAllProvinceXStoreService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};
