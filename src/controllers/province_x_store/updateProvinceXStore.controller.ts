import { Request, Response, Handler } from "express";
import { updateProvinceXStoreService } from "../../services/province_x_store/updateProvinceXStore.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const updateProvinceXStoreController: Handler = async (req: Request, res: Response) => {
    try {
        await updateProvinceXStoreService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};
