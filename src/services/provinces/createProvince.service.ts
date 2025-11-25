import { Request, Response } from "express";
import { Model } from "sequelize";
import { Provinces } from "../../models/Provinces";
import { ProvincesAttributes, ProvincesCreationAttributes } from "../../interfaces/provinces.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const createProvinceService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { province_name } = req.body;

        if (!province_name) {
            logger.error("El campo province_name es requerido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El campo province_name es requerido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        const existingProvince = await Provinces.findOne({ where: { province_name } });

        if (existingProvince) {
            logger.error(`La provincia ${province_name} ya existe | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: `La provincia ${province_name} ya existe. Por favor, elige otro nombre.`,
                statusCode: 409,
            };
            return res.status(409).json(responseError);
        }

        const province: Model<ProvincesAttributes, ProvincesCreationAttributes> = await Provinces.create({
            province_name,
        });

        return res.status(201).json({
            message: "Provincia creada exitosamente",
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
            message: error.message || `Error al crear provincia: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

