import { Request, Response } from "express";
import { Model } from "sequelize";
import { Categories } from "../../models/Categories";
import { CategoriesAttributes, CategoriesCreationAttributes } from "../../interfaces/categories.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const getAllCategoriesService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const categories: Model<CategoriesAttributes, CategoriesCreationAttributes>[] = await Categories.findAll({
            order: [["id_category", "ASC"]],
        });

        const categoriesData = categories.map((category) => ({
            id_category: category.getDataValue("id_category"),
            name_category: category.getDataValue("name_category"),
        }));

        return res.json({
            categories: categoriesData,
            total: categoriesData.length,
        });
    } catch (error: any) {
        const responseError: ErrorI = {
            error: true,
            message: `Error al obtener lista de categorías: ${error.message || error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

