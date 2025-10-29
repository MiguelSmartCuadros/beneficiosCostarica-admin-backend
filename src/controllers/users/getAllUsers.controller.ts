import { Request, Response, Handler } from "express";
import { getAllUsersService } from "../../services/users/getAllUsers.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getAllUsersController: Handler = async (req: Request, res: Response) => {
    try {
        await getAllUsersService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};
