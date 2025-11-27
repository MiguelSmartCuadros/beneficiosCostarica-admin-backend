import { Request, Response } from "express";
import { getStoreByIdService } from "../../services/stores/getStoreById.service";
import { logger } from "../../logger/logger";

export const getStoreByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const store = await getStoreByIdService(Number(id));

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Store retrieved successfully",
            data: store,
        });
    } catch (error) {
        logger.error("Error retrieving store: " + error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
