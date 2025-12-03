import { Request, Response } from "express";
import { getPresignedURL } from "../../AWS/S3/getPresignedURL.service";
import { Stores } from "../../models/Stores";
import { logger } from "../../logger/logger";

export const getStoreImagesUrlsController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const store = await Stores.findByPk(Number(id));

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found",
            });
        }

        const storeData = store.get({ plain: true }) as any;

        const imageUrls: any = {};

        // Generate presigned URLs for each image
        if (storeData.store_img_card) {
            imageUrls.store_img_card = await getPresignedURL(storeData.store_img_card);
        }

        if (storeData.store_img_highlight) {
            imageUrls.store_img_highlight = await getPresignedURL(storeData.store_img_highlight);
        }

        if (storeData.store_img_banner) {
            imageUrls.store_img_banner = await getPresignedURL(storeData.store_img_banner);
        }

        return res.status(200).json({
            success: true,
            message: "Store image URLs retrieved successfully",
            data: imageUrls,
        });
    } catch (error: any) {
        logger.error("Error getting store image URLs: " + error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message || error,
        });
    }
};
