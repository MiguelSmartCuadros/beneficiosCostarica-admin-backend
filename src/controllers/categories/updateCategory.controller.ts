import { Request, Response, Handler } from "express";
import { updateCategoryService } from "../../services/categories/updateCategory.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const updateCategoryController: Handler = async (req: Request, res: Response) => {
    try {
        await updateCategoryService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};

