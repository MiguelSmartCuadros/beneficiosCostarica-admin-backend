import { Request, Response } from "express";
import { Model, Op } from "sequelize";
import { Provinces } from "../../models/Provinces";
import { ProvincesAttributes, ProvincesCreationAttributes } from "../../interfaces/provinces.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const updateProvinceService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const id_province = Number(id);
        const { province_name } = req.body;

        if (!id_province || isNaN(id_province)) {
            logger.error("El ID de provincia debe ser un número válido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El ID de provincia debe ser un número válido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        if (!province_name) {
            logger.error("El campo province_name es requerido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El campo province_name es requerido",
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

        const existingProvince = await Provinces.findOne({
            where: {
                province_name,
                id_province: { [Op.ne]: id_province },
            },
        });

        if (existingProvince) {
            logger.error(`La provincia ${province_name} ya existe | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: `La provincia ${province_name} ya existe. Por favor, elige otro nombre.`,
                statusCode: 409,
            };
            return res.status(409).json(responseError);
        }

        await province.update({ province_name });

        return res.json({
            message: "Provincia actualizada exitosamente",
            province: {
                id_province: province.getDataValue("id_province"),
                province_name: province.getDataValue("province_name"),
            },
        });
    } catch (error: any) {
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            logger.error(`Error de validación: ${error.message} | status: 400`);
            const responseError: ErrorI = {
                error: true,
                message: error.message || "Error de validación. Verifica que todos los campos requeridos estén presentes.",
                statusCode: 400,
            };
            throw responseError;
        }

        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al actualizar provincia: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

