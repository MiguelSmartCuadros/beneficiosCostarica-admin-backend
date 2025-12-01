import { Request, Response } from "express";
import { DiscountCodes } from "../../models/DiscountCodes";
import { Stores } from "../../models/Stores";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getAllDiscountCodesService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const { count, rows: discountCodes } = await DiscountCodes.findAndCountAll({
            include: [
                {
                    model: Stores,
                    attributes: ["id_stores", "store_name"],
                    required: false,
                }
            ],
            limit,
            offset,
            order: [["id_discout_codes", "DESC"]],
        });

        logger.info(`Códigos de descuento obtenidos exitosamente. Total: ${count}, Página: ${page}`);

        return res.status(200).json({
            discountCodes,
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener códigos de descuento: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
