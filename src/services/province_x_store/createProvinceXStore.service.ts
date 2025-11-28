import { Request, Response } from "express";
import { Model } from "sequelize";
import { ProvinceXStore } from "../../models/ProvinceXStore";
import { ProvinceXStoreAttributes, ProvinceXStoreCreationAttributes } from "../../interfaces/province_x_store.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const createProvinceXStoreService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { province_id, store_id } = req.body;

        if (!province_id || !store_id) {
            logger.error("Los campos province_id y store_id son requeridos | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "Los campos province_id y store_id son requeridos",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        // Verificar si ya existe la relación
        const existingRelation = await ProvinceXStore.findOne({
            where: { province_id, store_id }
        });

        if (existingRelation) {
            logger.error(`La relación entre provincia ${province_id} y tienda ${store_id} ya existe | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: `La relación entre esta provincia y tienda ya existe.`,
                statusCode: 409,
            };
            return res.status(409).json(responseError);
        }

        const provinceXStore: Model<ProvinceXStoreAttributes, ProvinceXStoreCreationAttributes> = await ProvinceXStore.create({
            province_id,
            store_id,
        });

        return res.status(201).json({
            message: "Relación provincia-tienda creada exitosamente",
            provinceXStore: {
                id: provinceXStore.getDataValue("id"),
                province_id: provinceXStore.getDataValue("province_id"),
                store_id: provinceXStore.getDataValue("store_id"),
            },
        });
    } catch (error: any) {
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError" || error.name === "SequelizeForeignKeyConstraintError") {
            logger.error(`Error de validación: ${error.message} | status: 400`);
            const responseError: ErrorI = {
                error: true,
                message: error.message || "Error de validación. Verifica que los IDs de provincia y tienda sean válidos.",
                statusCode: 400,
            };
            throw responseError;
        }

        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al crear relación provincia-tienda: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
