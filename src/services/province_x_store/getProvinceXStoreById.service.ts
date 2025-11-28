import { Request, Response } from "express";
import { Model } from "sequelize";
import { ProvinceXStore } from "../../models/ProvinceXStore";
import { Provinces } from "../../models/Provinces";
import { Stores } from "../../models/Stores";
import { ProvinceXStoreAttributes, ProvinceXStoreCreationAttributes } from "../../interfaces/province_x_store.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getProvinceXStoreByIdService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            logger.error("El parámetro id es requerido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El parámetro id es requerido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        const provinceXStore: any = await ProvinceXStore.findByPk(id, {
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
        });

        if (!provinceXStore) {
            logger.error(`Relación provincia-tienda con id ${id} no encontrada | status: 404`);
            const responseError: ErrorI = {
                error: true,
                message: `Relación provincia-tienda con id ${id} no encontrada`,
                statusCode: 404,
            };
            return res.status(404).json(responseError);
        }

        return res.json({
            provinceXStore: {
                id: provinceXStore.getDataValue("id"),
                province_id: provinceXStore.getDataValue("province_id"),
                store_id: provinceXStore.getDataValue("store_id"),
                province: provinceXStore.province ? {
                    id_province: provinceXStore.province.getDataValue("id_province"),
                    province_name: provinceXStore.province.getDataValue("province_name"),
                } : null,
                store: provinceXStore.store ? {
                    id_stores: provinceXStore.store.getDataValue("id_stores"),
                    store_name: provinceXStore.store.getDataValue("store_name"),
                } : null,
            },
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener relación provincia-tienda: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
