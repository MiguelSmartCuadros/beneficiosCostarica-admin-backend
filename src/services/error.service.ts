import { Response } from "express";
import { ErrorI } from "../interfaces/error.interface";
import { logger } from "../logger/logger";

export const errorResponse = async (error: ErrorI | any, res: Response) => {
  try {
    if (
      "error" in error &&
      typeof error.error === "boolean" &&
      "message" in error &&
      typeof error.message === "string" &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
    ) {
      logger.error(`Error: ${error.message} | status: ${error.statusCode}`);
      return res.status(error.statusCode).json(error);
    } else {
      logger.error(`Error: ${error} | status: 500`);
      const responseError: ErrorI = {
        error: true,
        message: error instanceof Error ? error.message : `${error}`,
        statusCode: 500,
      };
      return res.status(500).json(responseError);
    }
  } catch (error: any) {
    const responseError: ErrorI = {
      error: true,
      message: error.message || "Error en servidor",
      statusCode: 500,
    };
    logger.error(`${responseError.message} | status: 500`);
    return res.status(responseError.statusCode).json(responseError);
  }
};
