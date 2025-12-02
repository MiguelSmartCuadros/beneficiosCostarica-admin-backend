import { Request, Response, Handler } from "express";
import { getAllTypeshopUrlsService } from "../../services/typeshop_urls/getAllTypeshopUrls.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getAllTypeshopUrlsController: Handler = async (req: Request, res: Response) => {
    try {
        await getAllTypeshopUrlsService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};
