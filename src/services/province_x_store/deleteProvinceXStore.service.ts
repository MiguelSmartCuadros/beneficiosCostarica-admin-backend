import { Request, Response } from "express";
import { ProvinceXStore } from "../../models/ProvinceXStore";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const deleteProvinceXStoreService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            logger.error("El parámetro id es requerido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El parámetro id es requerido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        const provinceXStore: any = await ProvinceXStore.findByPk(id);

        if (!provinceXStore) {
            logger.error(`Relación provincia-tienda con id ${id} no encontrada | status: 404`);
            const responseError: ErrorI = {
                error: true,
                message: `Relación provincia-tienda con id ${id} no encontrada`,
                statusCode: 404,
            };
            return res.status(404).json(responseError);
        }

        await provinceXStore.destroy();

        return res.json({
            message: "Relación provincia-tienda eliminada exitosamente",
            deletedId: id,
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al eliminar relación provincia-tienda: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};
