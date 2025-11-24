import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ErrorI } from "../interfaces/error.interface";

export const validateResetToken = (req: Request, res: Response, next: NextFunction) => {
    // Intentar obtener el token desde múltiples fuentes (en orden de prioridad):
    // 1. Query parameter: ?token=xxx
    // 2. Path parameter: /reset-password/:token
    // 3. Header personalizado: x-reset-token
    // 4. Authorization header: Bearer <token>
    // 5. Body (por compatibilidad con versiones anteriores)
    let token: string = "";
    
    if (req.query.token) {
        token = req.query.token.toString();
    } else if (req.params.token) {
        token = req.params.token.toString();
    } else if (req.headers["x-reset-token"]) {
        token = req.headers["x-reset-token"].toString();
    } else if (req.headers.authorization) {
        // Extraer token del formato "Bearer <token>"
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
    } else if (req.body.token) {
        token = req.body.token.toString();
    }

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
