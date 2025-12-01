import { Request, Response } from "express";
import { Model } from "sequelize";
import { DiscountCodes } from "../../models/DiscountCodes";
import { Stores } from "../../models/Stores";
import { DiscountCodesAttributes, DiscountCodesCreationAttributes } from "../../interfaces/discount_codes.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getDiscountCodeByIdService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            const responseError: ErrorI = {
                error: true,
                message: "ID de código de descuento inválido",
                statusCode: 400,
            };
            logger.error(`${responseError.message} | status: 400`);
            throw responseError;
        }

        const discountCode: Model<DiscountCodesAttributes, DiscountCodesCreationAttributes> | null = await DiscountCodes.findByPk(Number(id), {
            include: [
                {
                    model: Stores,
                    attributes: ["id_stores", "store_name"],
                    required: false,
                }
            ]
        });

        if (!discountCode) {
            const responseError: ErrorI = {
                error: true,
                message: "Código de descuento no encontrado",
                statusCode: 404,
            };
            logger.error(`${responseError.message} | status: 404`);
            throw responseError;
        }

        logger.info(`Código de descuento obtenido exitosamente con ID: ${id}`);

        return res.status(200).json({
            discountCode,
        });
    } catch (error: any) {
        if (error.statusCode) {
            throw error;
        }
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener código de descuento: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
