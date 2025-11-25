import { Request, Response, Handler } from "express";
import { getUserRoleByIdService } from "../../services/user_roles/getUserRoleById.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getUserRoleByIdController: Handler = async (req: Request, res: Response) => {
    try {
        await getUserRoleByIdService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};

