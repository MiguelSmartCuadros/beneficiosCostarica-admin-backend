import { Request, Response, Handler } from "express";
import { createTypeshopUrlsService } from "../../services/typeshop_urls/createTypeshopUrls.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const createTypeshopUrlsController: Handler = async (req: Request, res: Response) => {
    try {
        await createTypeshopUrlsService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};
