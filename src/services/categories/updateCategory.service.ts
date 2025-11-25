import { Request, Response } from "express";
import { Model, Op } from "sequelize";
import { Categories } from "../../models/Categories";
import { CategoriesAttributes, CategoriesCreationAttributes } from "../../interfaces/categories.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const updateCategoryService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const id_category = Number(id);
        const { name_category } = req.body;

        if (!id_category || isNaN(Number(id_category))) {
            logger.error("El ID de categoría debe ser un número válido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El ID de categoría debe ser un número válido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        if (!name_category) {
            logger.error("El campo name_category es requerido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El campo name_category es requerido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        const category: Model<CategoriesAttributes, CategoriesCreationAttributes> | null = await Categories.findByPk(Number(id_category));

        if (!category) {
            logger.error(`Categoría con ID ${id_category} no encontrada | status: 404`);
            const responseError: ErrorI = {
                error: true,
                message: `Categoría con ID ${id_category} no encontrada`,
                statusCode: 404,
            };
            return res.status(404).json(responseError);
        }

        // Verificar si el nuevo nombre ya existe en otra categoría
        const existingCategory = await Categories.findOne({
            where: {
                name_category,
                id_category: { [Op.ne]: Number(id_category) },
            },
        });

        if (existingCategory) {
            logger.error(`La categoría ${name_category} ya existe | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: `La categoría ${name_category} ya existe. Por favor, elige otro nombre.`,
                statusCode: 409,
            };
            return res.status(409).json(responseError);
        }

        await category.update({ name_category });

        return res.json({
            message: "Categoría actualizada exitosamente",
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
            message: error.message || `Error al actualizar categoría: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

