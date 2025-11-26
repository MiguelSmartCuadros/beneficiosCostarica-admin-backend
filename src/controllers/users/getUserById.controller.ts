import { Handler, Request, Response } from "express";
import { getUserByIdService } from "../../services/users/getUserById.service";
import { errorResponse } from "../../services/error.service";
import { ErrorI } from "../../interfaces/error.interface";

export const getUserByIdController: Handler = async (req: Request, res: Response) => {
    try {
        await getUserByIdService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};
