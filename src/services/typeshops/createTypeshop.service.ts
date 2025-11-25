import { Request, Response } from "express";
import { Model } from "sequelize";
import { Typeshops } from "../../models/Typeshops";
import { TypeshopsAttributes, TypeshopsCreationAttributes } from "../../interfaces/typeshops.interface";
import { logger } from "../../logger/logger";
import { ErrorI } from "../../interfaces/error.interface";

export const createTypeshopService: (req: Request, res: Response) => Promise<Response> = async (req: Request, res: Response) => {
    try {
        const { shop_type_name } = req.body;

        if (!shop_type_name) {
            logger.error("El campo shop_type_name es requerido | status: 400");
            const responseError: ErrorI = {
                error: true,
                message: "El campo shop_type_name es requerido",
                statusCode: 400,
            };
            return res.status(400).json(responseError);
        }

        const existingTypeshop = await Typeshops.findOne({ where: { shop_type_name } });

        if (existingTypeshop) {
            logger.error(`El tipo de tienda ${shop_type_name} ya existe | status: 409`);
            const responseError: ErrorI = {
                error: true,
                message: `El tipo de tienda ${shop_type_name} ya existe. Por favor, elige otro nombre.`,
                statusCode: 409,
            };
            return res.status(409).json(responseError);
        }

        const typeshop: Model<TypeshopsAttributes, TypeshopsCreationAttributes> = await Typeshops.create({
            shop_type_name,
        });

        return res.status(201).json({
            message: "Tipo de tienda creado exitosamente",
            typeshop: {
                id_type_shop: typeshop.getDataValue("id_type_shop"),
                shop_type_name: typeshop.getDataValue("shop_type_name"),
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
            message: error.message || `Error al crear tipo de tienda: ${error}`,
            statusCode: 500,
        };
        logger.error(`${responseError.message} | status: 500`);
        throw responseError;
    }
};

