import { Request, Response, Handler } from "express";
import { getAllUserRolesService } from "../../services/user_roles/getAllUserRoles.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const getAllUserRolesController: Handler = async (req: Request, res: Response) => {
    try {
        await getAllUserRolesService(req, res);
    } catch (error: ErrorI | any) {
        errorResponse(error, res);
    }
};

