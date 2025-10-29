import { Request, Response, NextFunction } from "express";
import { logger } from "../logger/logger";

export const errorHandler = (error: Error, _req: Request, _res: Response, _next: NextFunction) => {
  logger.error(error.message || `Ocurrió un error inesperado: ${error}`);
};
