import { Request, Response } from "express";
import { Model } from "sequelize";
import { Typeshops } from "../../models/Typeshops";
import { TypeshopsAttributes, TypeshopsCreationAttributes } from "../../interfaces/typeshops.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";
import { Stores } from "../../models/Stores";

export const deleteTypeshopService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const id_type_shop = Number(id);

        if (!id_type_shop || isNaN(id_type_shop)) {
            logger.error("El ID de tipo de tienda debe ser un número válido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El ID de tipo de tienda debe ser un número válido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        const typeshop: Model<TypeshopsAttributes, TypeshopsCreationAttributes> | null = await Typeshops.findByPk(id_type_shop);

        if (!typeshop) {
            logger.error(`Tipo de tienda con ID ${id_type_shop} no encontrado | status: 404`);
            const responseError: ErrorI = {
                error: true,
                message: `Tipo de tienda con ID ${id_type_shop} no encontrado`,
                statusCode: 404,
            };
            return res.status(404).json(responseError);
        }

        const storesCount = await Stores.count({
            where: {
                shop_type_id: id_type_shop,
            },
        });

        if (storesCount > 0) {
            logger.error(`No se puede eliminar el tipo de tienda porque tiene ${storesCount} store(s) asociado(s) | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: `No se puede eliminar el tipo de tienda porque tiene ${storesCount} store(s) asociado(s). Elimina o actualiza los stores primero.`,
                statusCode: 409,
            };
            return res.status(409).json(responseError);
        }

        await typeshop.destroy();

        return res.json({
            message: "Tipo de tienda eliminado exitosamente",
        });
    } catch (error: any) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            logger.error(`Error de restricción de clave foránea: ${error.message} | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: "No se puede eliminar el tipo de tienda porque tiene stores asociados. Elimina o actualiza los stores primero.",
                statusCode: 409,
            };
            throw responseError;
        }

        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al eliminar tipo de tienda: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

