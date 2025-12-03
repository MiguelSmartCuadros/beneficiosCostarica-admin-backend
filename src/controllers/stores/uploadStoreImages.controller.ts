import { Request, Response } from "express";
import { uploadToS3 } from "../../AWS/S3/uploadToS3.service";
import { updateStoreService } from "../../services/stores/updateStore.service";
import { logger } from "../../logger/logger";

export const uploadStoreImagesController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded",
            });
        }

        const updateData: any = {};

        // Process store_img_card
        if (files["store_img_card"] && files["store_img_card"][0]) {
            const file = files["store_img_card"][0];
            const key = await uploadToS3(file.buffer, file.originalname, file.mimetype);
            updateData.store_img_card = key;
        }

        // Process store_img_highlight
        if (files["store_img_highlight"] && files["store_img_highlight"][0]) {
            const file = files["store_img_highlight"][0];
            const key = await uploadToS3(file.buffer, file.originalname, file.mimetype);
            updateData.store_img_highlight = key;
        }

        // Process store_img_banner
        if (files["store_img_banner"] && files["store_img_banner"][0]) {
            const file = files["store_img_banner"][0];
            const key = await uploadToS3(file.buffer, file.originalname, file.mimetype);
            updateData.store_img_banner = key;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid image fields found",
            });
        }

        const updatedStore = await updateStoreService(Number(id), updateData);

        if (!updatedStore) {
            return res.status(404).json({
                success: false,
                message: "Store not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Store images uploaded successfully",
            data: updatedStore,
        });
    } catch (error: any) {
        logger.error("Error uploading store images: " + error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message || error,
        });
    }
};
