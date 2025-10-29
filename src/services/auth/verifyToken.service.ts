import { Request, Response } from "express";
import { ErrorI } from "../../interfaces/error.interface";

export const verifyTokenService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        return res.json({ validToken: true, user: req.user_data.username });
    } catch (error: any) {
        const responseError: ErrorI = {
        error: true,
        message: error.message || `${error}`,
        statusCode: 500,
        };
        throw responseError;
    }
};
