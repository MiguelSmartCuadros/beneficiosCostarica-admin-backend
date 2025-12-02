import { Request, Response } from "express";
import { Model } from "sequelize";
import { TypeshopUrls } from "../../models/TypeshopUrls";
import { TypeshopUrlsAttributes, TypeshopUrlsCreationAttributes } from "../../interfaces/typeshop_urls.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";
import { Stores } from "../../models/Stores";
import { Typeshops } from "../../models/Typeshops";

export const updateTypeshopUrlsService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const id_typeshop_urls = Number(id);
        const { store_id, typeshop_id, url } = req.body;

        if (!id_typeshop_urls || isNaN(id_typeshop_urls)) {
            return res.status(400).json({ error: true, message: "El ID debe ser un número válido", statusCode: 400 });
        }

        const typeshopUrls: Model<TypeshopUrlsAttributes, TypeshopUrlsCreationAttributes> | null = await TypeshopUrls.findByPk(id_typeshop_urls);

        if (!typeshopUrls) {
            return res.status(404).json({ error: true, message: `URL con ID ${id_typeshop_urls} no encontrada`, statusCode: 404 });
        }

        if (store_id) {
            const store = await Stores.findByPk(store_id);
            if (!store) {
                return res.status(404).json({ error: true, message: "Store no encontrado", statusCode: 404 });
            }
        }

        if (typeshop_id) {
            const typeshop = await Typeshops.findByPk(typeshop_id);
            if (!typeshop) {
                return res.status(404).json({ error: true, message: "Typeshop no encontrado", statusCode: 404 });
            }
        }

        await typeshopUrls.update({
            store_id: store_id || typeshopUrls.getDataValue("store_id"),
            typeshop_id: typeshop_id || typeshopUrls.getDataValue("typeshop_id"),
            url: url || typeshopUrls.getDataValue("url"),
        });

        return res.json({
            message: "URL actualizada exitosamente",
            typeshopUrls: {
                id_typeshop_urls: typeshopUrls.getDataValue("id_typeshop_urls"),
                store_id: typeshopUrls.getDataValue("store_id"),
                typeshop_id: typeshopUrls.getDataValue("typeshop_id"),
                url: typeshopUrls.getDataValue("url"),
            },
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al actualizar URL: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
