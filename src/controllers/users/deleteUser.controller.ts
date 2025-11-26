import { Handler, Request, Response } from "express";
import { deleteUserService } from "../../services/users/deleteUser.service";
import { errorResponse } from "../../services/error.service";
import { ErrorI } from "../../interfaces/error.interface";

export const deleteUserController: Handler = async (req: Request, res: Response) => {
    try {
        await deleteUserService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};
