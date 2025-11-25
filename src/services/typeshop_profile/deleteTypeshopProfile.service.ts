import { Request, Response } from "express";
import { Model } from "sequelize";
import { TypeshopProfile } from "../../models/TypeshopProfile";
import { TypeshopProfileAttributes, TypeshopProfileCreationAttributes } from "../../interfaces/typeshop_profile.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const deleteTypeshopProfileService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const id_typeshop_profile = Number(id);

        if (!id_typeshop_profile || isNaN(id_typeshop_profile)) {
            return res.status(400).json({ error: true, message: "El ID debe ser un número válido", statusCode: 400 });
        }

        const typeshopProfile: Model<TypeshopProfileAttributes, TypeshopProfileCreationAttributes> | null = await TypeshopProfile.findByPk(id_typeshop_profile);

        if (!typeshopProfile) {
            return res.status(404).json({ error: true, message: `Perfil con ID ${id_typeshop_profile} no encontrado`, statusCode: 404 });
        }

        await typeshopProfile.destroy();

        return res.json({
            message: "Perfil eliminado exitosamente",
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al eliminar perfil: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
