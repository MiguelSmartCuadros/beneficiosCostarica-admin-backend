import { Request, Response } from "express";
import { Model } from "sequelize";
import { AsignedCodesUser } from "../../models/AsignedCodesUser";
import { AsignedCodesUserAttributes, AsignedCodesUserCreationAttributes } from "../../interfaces/asigned_codes_user.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getAllAsignedCodesUserService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const asignedCodes: Model<AsignedCodesUserAttributes, AsignedCodesUserCreationAttributes>[] = await AsignedCodesUser.findAll({
            order: [["id", "ASC"]],
        });

        const asignedCodesData = asignedCodes.map((code) => ({
            id: code.getDataValue("id"),
            store_id: code.getDataValue("store_id"),
            code_id: code.getDataValue("code_id"),
            document_number: code.getDataValue("document_number"),
            is_black: code.getDataValue("is_black"),
            date: code.getDataValue("date"),
        }));

        return res.json({
            asigned_codes: asignedCodesData,
            total: asignedCodesData.length,
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener lista de códigos asignados: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
