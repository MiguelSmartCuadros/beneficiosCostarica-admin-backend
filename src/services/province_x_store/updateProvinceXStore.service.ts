import { Request, Response } from "express";
import { ProvinceXStore } from "../../models/ProvinceXStore";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const updateProvinceXStoreService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { province_id, store_id } = req.body;

        if (!id) {
            logger.error("El parámetro id es requerido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El parámetro id es requerido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        if (!province_id && !store_id) {
            logger.error("Debe proporcionar al menos un campo para actualizar | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "Debe proporcionar al menos un campo para actualizar (province_id o store_id)",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        const provinceXStore: any = await ProvinceXStore.findByPk(id);

        if (!provinceXStore) {
            logger.error(`Relación provincia-tienda con id ${id} no encontrada | status: 404`);
            const responseError: ErrorI = {
                error: true,
                message: `Relación provincia-tienda con id ${id} no encontrada`,
                statusCode: 404,
            };
            return res.status(404).json(responseError);
        }

        // Verificar si la nueva relación ya existe (si se están cambiando ambos campos)
        if (province_id && store_id) {
            const existingRelation = await ProvinceXStore.findOne({
                where: { province_id, store_id },
            });

            if (existingRelation && existingRelation.getDataValue("id") !== Number(id)) {
                logger.error(`La relación entre provincia ${province_id} y tienda ${store_id} ya existe | status: 409`);
                const responseError: ErrorI = {
                    error: true,
                    message: `La relación entre esta provincia y tienda ya existe.`,
                    statusCode: 409,
                };
                return res.status(409).json(responseError);
            }
        }

        const updateData: any = {};
        if (province_id) updateData.province_id = province_id;
        if (store_id) updateData.store_id = store_id;

        await provinceXStore.update(updateData);

        return res.json({
            message: "Relación provincia-tienda actualizada exitosamente",
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
            message: error.message || `Error al actualizar relación provincia-tienda: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
