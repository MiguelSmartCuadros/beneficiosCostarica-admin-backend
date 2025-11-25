import { Request, Response } from "express";
import { Model } from "sequelize";
import { Typeshops } from "../../models/Typeshops";
import { TypeshopsAttributes, TypeshopsCreationAttributes } from "../../interfaces/typeshops.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getAllTypeshopsService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const typeshops: Model<TypeshopsAttributes, TypeshopsCreationAttributes>[] = await Typeshops.findAll({
            order: [["id_type_shop", "ASC"]],
        });

        const typeshopsData = typeshops.map((typeshop) => ({
            id_type_shop: typeshop.getDataValue("id_type_shop"),
            shop_type_name: typeshop.getDataValue("shop_type_name"),
        }));

        return res.json({
            typeshops: typeshopsData,
            total: typeshopsData.length,
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener lista de tipos de tienda: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

