import { Request, Response } from "express";
import { Model } from "sequelize";
import { Provinces } from "../../models/Provinces";
import { ProvincesAttributes, ProvincesCreationAttributes } from "../../interfaces/provinces.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getProvinceByIdService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
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

        return res.json({
            province: {
                id_province: province.getDataValue("id_province"),
                province_name: province.getDataValue("province_name"),
            },
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener provincia: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

