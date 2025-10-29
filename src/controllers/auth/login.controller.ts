import { Request, Response, Handler } from "express";
import { loginService } from "../../services/auth/login.service";
import { ErrorI } from "../../interfaces/error.interface";
import { errorResponse } from "../../services/error.service";

export const loginController: Handler = async (req: Request, res: Response) => {
  try {
    await loginService(req, res);
  } catch (error: ErrorI | any) {
    errorResponse(error, res);
  }
};
