import { Request, Response } from "express";
import { Model } from "sequelize";
import { TypeshopProfile } from "../../models/TypeshopProfile";
import { TypeshopProfileAttributes, TypeshopProfileCreationAttributes } from "../../interfaces/typeshop_profile.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getTypeshopProfileByIdService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const id_typeshop_profile = Number(id);

        if (!id_typeshop_profile || isNaN(id_typeshop_profile)) {
            logger.error("El ID debe ser un número válido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El ID debe ser un número válido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        const typeshopProfile: Model<TypeshopProfileAttributes, TypeshopProfileCreationAttributes> | null = await TypeshopProfile.findByPk(id_typeshop_profile);

        if (!typeshopProfile) {
            logger.error(`Perfil con ID ${id_typeshop_profile} no encontrado | status: 404`);
            const responseError: ErrorI = {
                error: true,
                message: `Perfil con ID ${id_typeshop_profile} no encontrado`,
                statusCode: 404,
            };
            return res.status(404).json(responseError);
        }

        return res.json({
            typeshopProfile: {
                id_typeshop_profile: typeshopProfile.getDataValue("id_typeshop_profile"),
                store_id: typeshopProfile.getDataValue("store_id"),
                typeshop_id: typeshopProfile.getDataValue("typeshop_id"),
                url_store: typeshopProfile.getDataValue("url_store"),
            },
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al obtener perfil: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
