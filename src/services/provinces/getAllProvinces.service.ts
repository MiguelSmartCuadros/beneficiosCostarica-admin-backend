import { Request, Response } from "express";
import { Model } from "sequelize";
import { Provinces } from "../../models/Provinces";
import { ProvincesAttributes, ProvincesCreationAttributes } from "../../interfaces/provinces.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getAllProvincesService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const provinces: Model<ProvincesAttributes, ProvincesCreationAttributes>[] = await Provinces.findAll({
            order: [["id_province", "ASC"]],
        });

        const provincesData = provinces.map((province) => ({
            id_province: province.getDataValue("id_province"),
            province_name: province.getDataValue("province_name"),
        }));

        return res.json({
            provinces: provincesData,
            total: provincesData.length,
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener lista de provincias: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

