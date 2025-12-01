import { Request, Response, Handler } from "express";
import { createCategoryService } from "../../services/categories/createCategory.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const createCategoryController: Handler = async (req: Request, res: Response) => {
    try {
        await createCategoryService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};

