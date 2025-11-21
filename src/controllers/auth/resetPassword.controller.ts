import { Request, Response, Handler } from "express";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";
import { resetPasswordService } from "../../services/auth/resetPassword.service";

export const resetPasswordController: Handler = async (req: Request, res: Response) => {
    try {
        const username = req.body?.username;
        const email = req.body?.email;
        const usernameOrEmail = req.body?.usernameOrEmail;
        const new_password = req.body?.new_password;
        const token = req.body?.token;

        if ((!username && !email && !usernameOrEmail) || !new_password || !token) {
            return res.status(400).json({
                error: true,
                message: "Los campos username (o email), new_password y token son requeridos para resetear la contraseña.",
                statusCode: 400,
            });
        }
        await resetPasswordService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};
