import { Request, Response, Handler } from "express";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";
import { verifyTokenService } from "../../services/auth/verifyToken.service";

export const verifyTokenController: Handler = async (req: Request, res: Response) => {
    try {
        await verifyTokenService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};