import { Request, Response, Handler } from "express";
import { createUserRoleService } from "../../services/user_roles/createUserRole.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const createUserRoleController: Handler = async (req: Request, res: Response) => {
    try {
        await createUserRoleService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(res, error);
    }
};

