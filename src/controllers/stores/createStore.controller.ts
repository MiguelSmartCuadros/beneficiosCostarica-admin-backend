import { Request, Response } from "express";
import { createStoreService } from "../../services/stores/createStore.service";
import { uploadToS3 } from "../../AWS/S3/uploadToS3.service";
import { logger } from "../../logger/logger";

export const createStoreController = async (req: Request, res: Response) => {
    try {
        const storeData = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // Process store_img_card
        if (files && files["store_img_card"] && files["store_img_card"][0]) {
            const file = files["store_img_card"][0];
            const key = await uploadToS3(file.buffer, file.originalname, file.mimetype);
            storeData.store_img_card = key;
        }

        // Process store_img_highlight
        if (files && files["store_img_highlight"] && files["store_img_highlight"][0]) {
            const file = files["store_img_highlight"][0];
            const key = await uploadToS3(file.buffer, file.originalname, file.mimetype);
            storeData.store_img_highlight = key;
        }

        // Process store_img_banner
        if (files && files["store_img_banner"] && files["store_img_banner"][0]) {
            const file = files["store_img_banner"][0];
            const key = await uploadToS3(file.buffer, file.originalname, file.mimetype);
            storeData.store_img_banner = key;
        }

        const newStore = await createStoreService(storeData);
        return res.status(201).json({
            success: true,
            message: "Store created successfully",
            data: newStore,
        });
    } catch (error: any) {
        logger.error("Error creating store: " + error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message || error,
        });
    }
};
