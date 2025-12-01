import { Request, Response, Handler } from "express";
import { updateTypeshopProfileService } from "../../services/typeshop_profile/updateTypeshopProfile.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const updateTypeshopProfileController: Handler = async (req: Request, res: Response) => {
    try {
        await updateTypeshopProfileService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};
