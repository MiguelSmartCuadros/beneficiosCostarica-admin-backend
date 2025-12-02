import { Request, Response, Handler } from "express";
import { updateTypeshopUrlsService } from "../../services/typeshop_urls/updateTypeshopUrls.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const updateTypeshopUrlsController: Handler = async (req: Request, res: Response) => {
    try {
        await updateTypeshopUrlsService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};
