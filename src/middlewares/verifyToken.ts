import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../interfaces/jwt.interface";
import { logger } from "../logger/logger";
import { ErrorI } from "../interfaces/error.interface";

export const verify_JWT: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-access-token");

  if (!token) {
    logger.error("Acceso denegado, token inexistente | status: 401");
    const responseError: ErrorI = {
      error: true,
      message: "Acceso denegado. Token inexistente",
      statusCode: 401,
    };
    return res.status(401).json(responseError);
  }

  if (!process.env.WORD_SECRET) {
    logger.error("La variable de entorno WORD_SECRET no esta definida");
    const responseError: ErrorI = {
      error: true,
      message: "Error en servidor",
      statusCode: 500,
    };
    return res.status(500).json(responseError);
  }
  try {
    const payload: JwtPayload = jwt.verify(
      token,
      process.env.WORD_SECRET
    ) as JwtPayload;
    req.user_data = payload;
    next();
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.error("Token inválido | status: 401");
      const responseError: ErrorI = {
        error: true,
        message: "Token inválido",
        statusCode: 401,
      };
      return res.status(401).json(responseError);
    }
    const responseError: ErrorI = {
      error: true,
      message: error?.message || "Error al autenticar token",
      statusCode: 500,
    };
    logger.error(responseError.message + " | status: 500");
    res.status(500).json(responseError);
  }
};
