import { Request, Response, Handler } from "express";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";
import { forgotPasswordService } from "../../services/auth/forgotPassword.service";

export const forgotPasswordController: Handler = async (req: Request, res: Response) => {
    try {
        await forgotPasswordService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};


