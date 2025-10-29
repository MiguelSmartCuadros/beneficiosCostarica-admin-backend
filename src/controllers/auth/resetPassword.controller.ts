import { Request, Response, Handler } from "express";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";
import { resetPasswordService } from "../../services/auth/resetPassword.service";

export const resetPasswordController: Handler = async (req: Request, res: Response) => {
    try {
        await resetPasswordService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};


