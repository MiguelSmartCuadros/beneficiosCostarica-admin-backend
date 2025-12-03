import { Request, Response } from "express";
import { Model } from "sequelize";
import { TypeshopUrls } from "../../models/TypeshopUrls";
import { TypeshopUrlsAttributes, TypeshopUrlsCreationAttributes } from "../../interfaces/typeshop_urls.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getAllTypeshopUrlsService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const typeshopUrls: Model<TypeshopUrlsAttributes, TypeshopUrlsCreationAttributes>[] = await TypeshopUrls.findAll({
            order: [["id_typeshop_urls", "ASC"]],
        });

        const typeshopUrlsData = typeshopUrls.map((url) => ({
            id_typeshop_urls: url.getDataValue("id_typeshop_urls"),
            store_id: url.getDataValue("store_id"),
            typeshop_id: url.getDataValue("typeshop_id"),
            url_store: url.getDataValue("url_store"),
        }));

        return res.json({
            typeshopUrls: typeshopUrlsData,
            total: typeshopUrlsData.length,
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener lista de URLs de tipo de tienda: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
