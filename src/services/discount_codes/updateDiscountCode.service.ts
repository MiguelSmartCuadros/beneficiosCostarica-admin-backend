import { Request, Response } from "express";
import { Model } from "sequelize";
import { DiscountCodes } from "../../models/DiscountCodes";
import { Stores } from "../../models/Stores";
import { DiscountCodesAttributes, DiscountCodesCreationAttributes } from "../../interfaces/discount_codes.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const updateDiscountCodeService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { store_id, codes } = req.body;

        if (!id || isNaN(Number(id))) {
            const responseError: ErrorI = {
                error: true,
                message: "ID de código de descuento inválido",
                statusCode: 400,
            };
            logger.error(`${responseError.message} | status: 400`);
            throw responseError;
        }

        const discountCode: Model<DiscountCodesAttributes, DiscountCodesCreationAttributes> | null = await DiscountCodes.findByPk(Number(id));

        if (!discountCode) {
            const responseError: ErrorI = {
                error: true,
                message: "Código de descuento no encontrado",
                statusCode: 404,
            };
            logger.error(`${responseError.message} | status: 404`);
            throw responseError;
        }

        // Verificar que la tienda existe si se está actualizando
        if (store_id) {
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
        }

        // Actualizar campos
        if (store_id !== undefined) discountCode.setDataValue("store_id", store_id);
        if (codes !== undefined) discountCode.setDataValue("codes", codes);

        await discountCode.save();

        // Obtener código actualizado con relaciones
        const updatedDiscountCode = await DiscountCodes.findByPk(Number(id), {
            include: [
                {
                    model: Stores,
                    attributes: ["id_stores", "store_name"],
                    required: false,
                }
            ]
        });

        logger.info(`Código de descuento actualizado exitosamente con ID: ${id}`);

        return res.status(200).json({
            message: "Código de descuento actualizado exitosamente",
            discountCode: updatedDiscountCode,
        });
    } catch (error: any) {
        if (error.statusCode) {
            throw error;
        }
        const responseError: ErrorI = {
            error: true,
            message: `Error al actualizar código de descuento: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
