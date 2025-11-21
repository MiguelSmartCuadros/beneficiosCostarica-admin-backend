import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ErrorI } from "../interfaces/error.interface";

export const validateResetToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token ? req.body.token.toString() : "";

    if (!token) {
        const responseError: ErrorI = {
            error: true,
            message: "El token es requerido",
            statusCode: 400,
        };
        return res.status(400).json(responseError);
    }

    if (!process.env.WORD_SECRET) {
        const responseError: ErrorI = {
            error: true,
            message: "Error de configuración del servidor",
            statusCode: 500,
        };
        return res.status(500).json(responseError);
    }

    try {
        const payload: any = jwt.verify(token, process.env.WORD_SECRET);

        if (payload?.purpose !== "password_reset" || !payload?.id_user) {
            const responseError: ErrorI = {
                error: true,
                message: "Token de reseteo inválido",
                statusCode: 401,
            };
            return res.status(401).json(responseError);
        }

        // Store payload in res.locals for the service to use
        res.locals.resetTokenPayload = payload;
        next();
    } catch (err: any) {
        const responseError: ErrorI = {
            error: true,
            message: "Token inválido o expirado",
            statusCode: 401,
        };
        return res.status(401).json(responseError);
    }
};
