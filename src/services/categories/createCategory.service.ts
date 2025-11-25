import { Request, Response } from "express";
import { Categories } from "../../models/Categories";
import { Model } from "sequelize";
import { CategoriesAttributes, CategoriesCreationAttributes } from "../../interfaces/categories.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const createCategoryService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { name_category } = req.body;

        if (!name_category) {
            logger.error("El campo name_category es requerido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El campo name_category es requerido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        // Verificar si la categoría ya existe
        const existingCategory = await Categories.findOne({ where: { name_category } });
        if (existingCategory) {
            logger.error(`La categoría ${name_category} ya existe | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: `La categoría ${name_category} ya existe. Por favor, elige otro nombre.`,
                statusCode: 409,
            };
            return res.status(409).json(responseError);
        }

        const category: Model<CategoriesAttributes, CategoriesCreationAttributes> = await Categories.create({
            name_category,
        });

        return res.status(201).json({
            message: "Categoría creada exitosamente",
            category: {
                id_category: category.getDataValue("id_category"),
                name_category: category.getDataValue("name_category"),
            },
        });
    } catch (error: any) {
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            logger.error(`Error de validación: ${error.message} | status: 400`);
            const responseError: ErrorI = {
                error: true,
                message: error.message || "Error de validación. Verifica que todos los campos requeridos estén presentes.",
                statusCode: 400,
            };
            throw responseError;
        }

        const responseError: ErrorI = {
            error: true,
            message: error.message || `Error al crear categoría: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

