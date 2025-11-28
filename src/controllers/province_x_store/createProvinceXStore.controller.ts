import { Request, Response, Handler } from "express";
import { createProvinceXStoreService } from "../../services/province_x_store/createProvinceXStore.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const createProvinceXStoreController: Handler = async (req: Request, res: Response) => {
    try {
        await createProvinceXStoreService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};
