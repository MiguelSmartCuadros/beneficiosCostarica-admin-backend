import { Request, Response } from "express";
import { Model } from "sequelize";
import { TypeshopProfile } from "../../models/TypeshopProfile";
import { TypeshopProfileAttributes, TypeshopProfileCreationAttributes } from "../../interfaces/typeshop_profile.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";
import { Stores } from "../../models/Stores";
import { Typeshops } from "../../models/Typeshops";

export const updateTypeshopProfileService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const id_typeshop_profile = Number(id);
        const { store_id, typeshop_id, url_store } = req.body;

        if (!id_typeshop_profile || isNaN(id_typeshop_profile)) {
            return res.status(400).json({ error: true, message: "El ID debe ser un número válido", statusCode: 400 });
        }

        const typeshopProfile: Model<TypeshopProfileAttributes, TypeshopProfileCreationAttributes> | null = await TypeshopProfile.findByPk(id_typeshop_profile);

        if (!typeshopProfile) {
            return res.status(404).json({ error: true, message: `Perfil con ID ${id_typeshop_profile} no encontrado`, statusCode: 404 });
        }

        if (store_id) {
            const store = await Stores.findByPk(store_id);
            if (!store) {
                return res.status(404).json({ error: true, message: "Store no encontrado", statusCode: 404 });
            }
        }

        if (typeshop_id) {
            const typeshop = await Typeshops.findByPk(typeshop_id);
            if (!typeshop) {
                return res.status(404).json({ error: true, message: "Typeshop no encontrado", statusCode: 404 });
            }
        }

        await typeshopProfile.update({
            store_id: store_id || typeshopProfile.getDataValue("store_id"),
            typeshop_id: typeshop_id || typeshopProfile.getDataValue("typeshop_id"),
            url_store: url_store || typeshopProfile.getDataValue("url_store"),
        });

        return res.json({
            message: "Perfil actualizado exitosamente",
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
            message: error.message || `Error al actualizar perfil: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
