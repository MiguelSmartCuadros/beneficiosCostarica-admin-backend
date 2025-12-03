import { Request, Response } from "express";
import { Model } from "sequelize";
import { TypeshopUrls } from "../../models/TypeshopUrls";
import { TypeshopUrlsAttributes, TypeshopUrlsCreationAttributes } from "../../interfaces/typeshop_urls.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getTypeshopUrlsByIdService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const id_typeshop_urls = Number(id);

        if (!id_typeshop_urls || isNaN(id_typeshop_urls)) {
            logger.error("El ID debe ser un número válido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El ID debe ser un número válido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        const typeshopUrls: Model<TypeshopUrlsAttributes, TypeshopUrlsCreationAttributes> | null = await TypeshopUrls.findByPk(id_typeshop_urls);

        if (!typeshopUrls) {
            logger.error(`URL con ID ${id_typeshop_urls} no encontrada | status: 404`);
            const responseError: ErrorI = {
                error: true,
                message: `URL con ID ${id_typeshop_urls} no encontrada`,
                statusCode: 404,
            };
            return res.status(404).json(responseError);
        }

        return res.json({
            typeshopUrls: {
                id_typeshop_urls: typeshopUrls.getDataValue("id_typeshop_urls"),
                store_id: typeshopUrls.getDataValue("store_id"),
                typeshop_id: typeshopUrls.getDataValue("typeshop_id"),
                url_store: typeshopUrls.getDataValue("url_store"),
            },
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al obtener URL: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
