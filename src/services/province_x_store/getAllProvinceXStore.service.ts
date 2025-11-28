import { Request, Response } from "express";
import { Model } from "sequelize";
import { ProvinceXStore } from "../../models/ProvinceXStore";
import { Provinces } from "../../models/Provinces";
import { Stores } from "../../models/Stores";
import { ProvinceXStoreAttributes, ProvinceXStoreCreationAttributes } from "../../interfaces/province_x_store.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getAllProvinceXStoreService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const { count, rows: provinceXStores } = await ProvinceXStore.findAndCountAll({
            include: [
                {
                    model: Provinces,
                    attributes: ["id_province", "province_name"],
                },
                {
                    model: Stores,
                    attributes: ["id_stores", "store_name"],
                },
            ],
            limit: Number(limit),
            offset: offset,
            order: [["id", "ASC"]],
        });

        const provinceXStoresData = provinceXStores.map((item: any) => ({
            id: item.getDataValue("id"),
            province_id: item.getDataValue("province_id"),
            store_id: item.getDataValue("store_id"),
            province: item.province ? {
                id_province: item.province.getDataValue("id_province"),
                province_name: item.province.getDataValue("province_name"),
            } : null,
            store: item.store ? {
                id_stores: item.store.getDataValue("id_stores"),
                store_name: item.store.getDataValue("store_name"),
            } : null,
        }));

        return res.json({
            provinceXStores: provinceXStoresData,
            total: count,
            page: Number(page),
            totalPages: Math.ceil(count / Number(limit)),
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener lista de relaciones provincia-tienda: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
