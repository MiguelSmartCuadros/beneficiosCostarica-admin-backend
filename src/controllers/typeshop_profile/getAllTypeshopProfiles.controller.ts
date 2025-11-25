import { Request, Response, Handler } from "express";
import { getAllTypeshopProfilesService } from "../../services/typeshop_profile/getAllTypeshopProfiles.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getAllTypeshopProfilesController: Handler = async (req: Request, res: Response) => {
    try {
        await getAllTypeshopProfilesService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};
