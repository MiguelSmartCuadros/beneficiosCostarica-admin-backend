import { Request, Response } from "express";
import { Model } from "sequelize";
import { TypeshopProfile } from "../../models/TypeshopProfile";
import { TypeshopProfileAttributes, TypeshopProfileCreationAttributes } from "../../interfaces/typeshop_profile.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getAllTypeshopProfilesService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const typeshopProfiles: Model<TypeshopProfileAttributes, TypeshopProfileCreationAttributes>[] = await TypeshopProfile.findAll({
            order: [["id_typeshop_profile", "ASC"]],
        });

        const typeshopProfilesData = typeshopProfiles.map((profile) => ({
            id_typeshop_profile: profile.getDataValue("id_typeshop_profile"),
            store_id: profile.getDataValue("store_id"),
            typeshop_id: profile.getDataValue("typeshop_id"),
            url_store: profile.getDataValue("url_store"),
        }));

        return res.json({
            typeshopProfiles: typeshopProfilesData,
            total: typeshopProfilesData.length,
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener lista de perfiles de tipo de tienda: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
