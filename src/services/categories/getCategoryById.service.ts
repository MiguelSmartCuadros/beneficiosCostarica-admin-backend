import { Request, Response } from "express";
import { Model } from "sequelize";
import { Categories } from "../../models/Categories";
import { CategoriesAttributes, CategoriesCreationAttributes } from "../../interfaces/categories.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getCategoryByIdService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
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

        return res.json({
            category: {
                id_category: category.getDataValue("id_category"),
                name_category: category.getDataValue("name_category"),
            },
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener categoría: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

