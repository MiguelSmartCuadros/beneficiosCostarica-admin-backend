import { Request, Response, Handler } from "express";
import { deleteTypeshopUrlsService } from "../../services/typeshop_urls/deleteTypeshopUrls.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const deleteTypeshopUrlsController: Handler = async (req: Request, res: Response) => {
    try {
        await deleteTypeshopUrlsService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};
