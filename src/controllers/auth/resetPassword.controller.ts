import { Request, Response, Handler } from "express";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";
import { resetPasswordService } from "../../services/auth/resetPassword.service";

export const resetPasswordController: Handler = async (req: Request, res: Response) => {
    try {
        const username = req.body?.username;
        const email = req.body?.email;
        const new_password = req.body?.new_password;

        // Normalizar y validar que no sean strings vacíos
        const usernameStr = username ? String(username).trim() : "";
        const emailStr = email ? String(email).trim() : "";
        const newPasswordStr = new_password ? String(new_password).trim() : "";

        // Validar que al menos uno de username o email esté presente y no vacío, y que new_password esté presente
        if ((usernameStr === "" && emailStr === "") || newPasswordStr === "") {
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
