import { Handler, Request, Response } from "express";
import { updateUserService } from "../../services/users/updateUser.service";
import { errorResponse } from "../../services/error.service";
import { ErrorI } from "../../interfaces/error.interface";

export const updateUserController: Handler = async (req: Request, res: Response) => {
    try {
        await updateUserService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};
