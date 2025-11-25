import { Request, Response } from "express";
import { Model } from "sequelize";
import { Provinces } from "../../models/Provinces";
import { ProvincesAttributes, ProvincesCreationAttributes } from "../../interfaces/provinces.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";
import { Stores } from "../../models/Stores";

export const deleteProvinceService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const id_province = Number(id);

        if (!id_province || isNaN(id_province)) {
            logger.error("El ID de provincia debe ser un número válido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El ID de provincia debe ser un número válido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        const province: Model<ProvincesAttributes, ProvincesCreationAttributes> | null = await Provinces.findByPk(id_province);

        if (!province) {
            logger.error(`Provincia con ID ${id_province} no encontrada | status: 404`);
            const responseError: ErrorI = {
                error: true,
                message: `Provincia con ID ${id_province} no encontrada`,
                statusCode: 404,
            };
            return res.status(404).json(responseError);
        }

        const storesCount = await Stores.count({
            where: {
                province_id: id_province,
            },
        });

        if (storesCount > 0) {
            logger.error(`No se puede eliminar la provincia porque tiene ${storesCount} store(s) asociado(s) | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: `No se puede eliminar la provincia porque tiene ${storesCount} store(s) asociado(s). Elimina o actualiza los stores primero.`,
                statusCode: 409,
            };
            return res.status(409).json(responseError);
        }

        await province.destroy();

        return res.json({
            message: "Provincia eliminada exitosamente",
        });
    } catch (error: any) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            logger.error(`Error de restricción de clave foránea: ${error.message} | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: "No se puede eliminar la provincia porque tiene stores asociados. Elimina o actualiza los stores primero.",
                statusCode: 409,
            };
            throw responseError;
        }

        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al eliminar provincia: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

