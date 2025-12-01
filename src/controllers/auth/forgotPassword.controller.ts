import { Request, Response, Handler } from "express";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";
import { forgotPasswordService } from "../../services/auth/forgotPassword.service";

export const forgotPasswordController: Handler = async (req: Request, res: Response) => {
    try {
        const username = req.body?.username;

        if (!username) {
            return res.status(400).json({
                error: true,
                message: "El campo username es requerido para solicitar recuperación.",
                statusCode: 400,
            });
        }

        return await forgotPasswordService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};


