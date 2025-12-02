import { Request, Response, Handler } from "express";
import { getTypeshopUrlsByIdService } from "../../services/typeshop_urls/getTypeshopUrlsById.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getTypeshopUrlsByIdController: Handler = async (req: Request, res: Response) => {
    try {
        await getTypeshopUrlsByIdService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};
