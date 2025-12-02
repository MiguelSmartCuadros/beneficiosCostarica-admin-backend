import { Request, Response } from "express";
import { Model } from "sequelize";
import { TypeshopUrls } from "../../models/TypeshopUrls";
import { TypeshopUrlsAttributes, TypeshopUrlsCreationAttributes } from "../../interfaces/typeshop_urls.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";
import { Stores } from "../../models/Stores";
import { Typeshops } from "../../models/Typeshops";

export const createTypeshopUrlsService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { store_id, typeshop_id, url_store } = req.body;

        if (!store_id || !typeshop_id || !url_store) {
            logger.error("Los campos store_id, typeshop_id y url_store son requeridos | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "Los campos store_id, typeshop_id y url_store son requeridos",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        // Verificar si existen store y typeshop
        const store = await Stores.findByPk(store_id);
        if (!store) {
            return res.status(404).json({ error: true, message: "Store no encontrado", statusCode: 404 });
        }

        const typeshop = await Typeshops.findByPk(typeshop_id);
        if (!typeshop) {
            return res.status(404).json({ error: true, message: "Typeshop no encontrado", statusCode: 404 });
        }

        const typeshopUrls: Model<TypeshopUrlsAttributes, TypeshopUrlsCreationAttributes> = await TypeshopUrls.create({
            store_id,
            typeshop_id,
            url_store,
        });

        return res.status(201).json({
            message: "URL de tipo de tienda creada exitosamente",
            typeshopUrls: {
                id_typeshop_urls: typeshopUrls.getDataValue("id_typeshop_urls"),
                store_id: typeshopUrls.getDataValue("store_id"),
                typeshop_id: typeshopUrls.getDataValue("typeshop_id"),
                url: typeshopUrls.getDataValue("url_store"),
            },
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al crear URL de tipo de tienda: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
