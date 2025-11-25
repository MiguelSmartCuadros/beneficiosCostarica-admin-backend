import { Request, Response, Handler } from "express";
import { deleteTypeshopProfileService } from "../../services/typeshop_profile/deleteTypeshopProfile.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const deleteTypeshopProfileController: Handler = async (req: Request, res: Response) => {
    try {
        await deleteTypeshopProfileService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};
