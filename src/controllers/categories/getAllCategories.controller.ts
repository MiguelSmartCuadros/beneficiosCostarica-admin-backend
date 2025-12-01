import { Request, Response, Handler } from "express";
import { getAllCategoriesService } from "../../services/categories/getAllCategories.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getAllCategoriesController: Handler = async (req: Request, res: Response) => {
    try {
        await getAllCategoriesService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};

