import { Request, Response, Handler } from "express";
import { deleteCategoryService } from "../../services/categories/deleteCategory.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const deleteCategoryController: Handler = async (req: Request, res: Response) => {
    try {
        await deleteCategoryService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};

