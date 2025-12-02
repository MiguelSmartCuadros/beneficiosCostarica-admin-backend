import { Request, Response } from "express";
import { Model } from "sequelize";
import { TypeshopUrls } from "../../models/TypeshopUrls";
import { TypeshopUrlsAttributes, TypeshopUrlsCreationAttributes } from "../../interfaces/typeshop_urls.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const deleteTypeshopUrlsService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const id_typeshop_urls = Number(id);

        if (!id_typeshop_urls || isNaN(id_typeshop_urls)) {
            return res.status(400).json({ error: true, message: "El ID debe ser un número válido", statusCode: 400 });
        }

        const typeshopUrls: Model<TypeshopUrlsAttributes, TypeshopUrlsCreationAttributes> | null = await TypeshopUrls.findByPk(id_typeshop_urls);

        if (!typeshopUrls) {
            return res.status(404).json({ error: true, message: `URL con ID ${id_typeshop_urls} no encontrada`, statusCode: 404 });
        }

        await typeshopUrls.destroy();

        return res.json({
            message: "URL eliminada exitosamente",
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al eliminar URL: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
