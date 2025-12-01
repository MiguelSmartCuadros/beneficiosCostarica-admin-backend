import { Request, Response } from "express";
import { DiscountCodes } from "../../models/DiscountCodes";
import { Stores } from "../../models/Stores";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const createDiscountCodeService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { store_id, codes } = req.body;

        if (!store_id || !codes) {
            const responseError: ErrorI = {
                error: true,
                message: "Los campos store_id y codes son requeridos",
                statusCode: 400,
            };
            logger.error(`${responseError.message} | status: 400`);
            throw responseError;
        }

        // Verificar que la tienda existe
        const store = await Stores.findByPk(store_id);
        if (!store) {
            const responseError: ErrorI = {
                error: true,
                message: "La tienda especificada no existe",
                statusCode: 404,
            };
            logger.error(`${responseError.message} | status: 404`);
            throw responseError;
        }

        const newDiscountCode = await DiscountCodes.create({
            store_id,
            codes,
        });

        logger.info(`Código de descuento creado exitosamente con ID: ${newDiscountCode.getDataValue("id_discout_codes")}`);

        return res.status(201).json({
            message: "Código de descuento creado exitosamente",
            discountCode: newDiscountCode,
        });
    } catch (error: any) {
        if (error.statusCode) {
            throw error;
        }
        const responseError: ErrorI = {
            error: true,
            message: `Error al crear código de descuento: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
