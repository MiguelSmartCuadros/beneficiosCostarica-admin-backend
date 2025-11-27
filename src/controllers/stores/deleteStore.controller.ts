import { Request, Response } from "express";
import { deleteStoreService } from "../../services/stores/deleteStore.service";
import { logger } from "../../logger/logger";

export const deleteStoreController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await deleteStoreService(Number(id));

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Store not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Store deleted successfully",
        });
    } catch (error) {
        logger.error("Error deleting store: " + error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
