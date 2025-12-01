import { Request, Response, Handler } from "express";
import { updateUserRoleService } from "../../services/user_roles/updateUserRole.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const updateUserRoleController: Handler = async (req: Request, res: Response) => {
    try {
        await updateUserRoleService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};

