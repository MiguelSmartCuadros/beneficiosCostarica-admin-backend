import { Request, Response } from "express";
import { updateStoreService } from "../../services/stores/updateStore.service";
import { logger } from "../../logger/logger";

export const updateStoreController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const storeData = req.body;
        const updatedStore = await updateStoreService(Number(id), storeData);

        if (!updatedStore) {
            return res.status(404).json({
                success: false,
                message: "Store not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Store updated successfully",
            data: updatedStore,
        });
    } catch (error) {
        logger.error("Error updating store: " + error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
