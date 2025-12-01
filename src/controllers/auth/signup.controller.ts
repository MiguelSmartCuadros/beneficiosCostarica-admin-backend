import { Request, Response, Handler } from "express";
import { signupService } from "../../services/auth/signup.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const signupController: Handler = async (req: Request, res: Response) => {
    try {
        await signupService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};
