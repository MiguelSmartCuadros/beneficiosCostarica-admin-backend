import { Request, Response, Handler } from "express";
import { deleteUserRoleService } from "../../services/user_roles/deleteUserRole.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const deleteUserRoleController: Handler = async (req: Request, res: Response) => {
    try {
        await deleteUserRoleService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};

