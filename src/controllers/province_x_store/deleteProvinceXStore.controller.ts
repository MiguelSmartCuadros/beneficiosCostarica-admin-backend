import { Request, Response, Handler } from "express";
import { deleteProvinceXStoreService } from "../../services/province_x_store/deleteProvinceXStore.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const deleteProvinceXStoreController: Handler = async (req: Request, res: Response) => {
    try {
        await deleteProvinceXStoreService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};
