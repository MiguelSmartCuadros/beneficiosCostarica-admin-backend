import { Request, Response, Handler } from "express";
import { createTypeshopProfileService } from "../../services/typeshop_profile/createTypeshopProfile.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const createTypeshopProfileController: Handler = async (req: Request, res: Response) => {
    try {
        await createTypeshopProfileService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};
