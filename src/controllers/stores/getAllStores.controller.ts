import { Request, Response } from "express";
import { getAllStoresService } from "../../services/stores/getAllStores.service";
import { logger } from "../../logger/logger";

export const getAllStoresController = async (req: Request, res: Response) => {
    try {
        const stores = await getAllStoresService();
        return res.status(200).json({
            success: true,
            message: "Stores retrieved successfully",
            data: stores,
        });
    } catch (error) {
        logger.error("Error retrieving stores: " + error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
