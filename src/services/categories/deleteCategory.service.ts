import { Request, Response } from "express";
import { Model } from "sequelize";
import { Categories } from "../../models/Categories";
import { CategoriesAttributes, CategoriesCreationAttributes } from "../../interfaces/categories.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";
import { Stores } from "../../models/Stores";

export const deleteCategoryService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            logger.error("El ID de categoría debe ser un número válido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El ID de categoría debe ser un número válido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        const category: Model<CategoriesAttributes, CategoriesCreationAttributes> | null = await Categories.findByPk(Number(id));

        if (!category) {
            logger.error(`Categoría con ID ${id} no encontrada | status: 404`);
            const responseError: ErrorI = {
                error: true,
                message: `Categoría con ID ${id} no encontrada`,
                statusCode: 404,
            };
            return res.status(404).json(responseError);
        }

        // Verificar si hay stores asociados a esta categoría
        const storesCount = await Stores.count({
            where: {
                category_id: Number(id),
            },
        });

        if (storesCount > 0) {
            logger.error(`No se puede eliminar la categoría porque tiene ${storesCount} store(s) asociado(s) | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: `No se puede eliminar la categoría porque tiene ${storesCount} store(s) asociado(s). Elimina o actualiza los stores primero.`,
                statusCode: 409,
            };
            return res.status(409).json(responseError);
        }

        await category.destroy();

        return res.json({
            message: "Categoría eliminada exitosamente",
        });
    } catch (error: any) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            logger.error(`Error de restricción de clave foránea: ${error.message} | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: "No se puede eliminar la categoría porque tiene stores asociados. Elimina o actualiza los stores primero.",
                statusCode: 409,
            };
            throw responseError;
        }

        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al eliminar categoría: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

