import { Request, Response, Handler } from "express";
import { getAllAsignedCodesUserService } from "../../services/asigned_codes_user/getAllAsignedCodesUser.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getAllAsignedCodesUserController: Handler = async (req: Request, res: Response) => {
    try {
        await getAllAsignedCodesUserService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};
