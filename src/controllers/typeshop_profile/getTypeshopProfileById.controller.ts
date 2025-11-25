import { Request, Response, Handler } from "express";
import { getTypeshopProfileByIdService } from "../../services/typeshop_profile/getTypeshopProfileById.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getTypeshopProfileByIdController: Handler = async (req: Request, res: Response) => {
    try {
        await getTypeshopProfileByIdService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};
