import { Request, Response } from "express";
import { Model } from "sequelize";
import { Typeshops } from "../../models/Typeshops";
import { TypeshopsAttributes, TypeshopsCreationAttributes } from "../../interfaces/typeshops.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getTypeshopByIdService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const id_type_shop = Number(id);

        if (!id_type_shop || isNaN(id_type_shop)) {
            logger.error("El ID de tipo de tienda debe ser un número válido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El ID de tipo de tienda debe ser un número válido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        const typeshop: Model<TypeshopsAttributes, TypeshopsCreationAttributes> | null = await Typeshops.findByPk(id_type_shop);

        if (!typeshop) {
            logger.error(`Tipo de tienda con ID ${id_type_shop} no encontrado | status: 404`);
            const responseError: ErrorI = {
                error: true,
                message: `Tipo de tienda con ID ${id_type_shop} no encontrado`,
                statusCode: 404,
            };
            return res.status(404).json(responseError);
        }

        return res.json({
            typeshop: {
                id_type_shop: typeshop.getDataValue("id_type_shop"),
                shop_type_name: typeshop.getDataValue("shop_type_name"),
            },
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener tipo de tienda: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

