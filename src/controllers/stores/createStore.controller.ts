import { Request, Response } from "express";
import { createStoreService } from "../../services/stores/createStore.service";
import { logger } from "../../logger/logger";

export const createStoreController = async (req: Request, res: Response) => {
    try {
        const storeData = req.body;
        const newStore = await createStoreService(storeData);
        return res.status(201).json({
            success: true,
            message: "Store created successfully",
            data: newStore,
        });
    } catch (error) {
        logger.error("Error creating store: " + error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
