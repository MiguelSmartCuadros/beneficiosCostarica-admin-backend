import { Request, Response } from "express";
import { getAllTextElementsService } from "../../services/text_elements/getAllTextElements.service";
import { logger } from "../../logger/logger";

export const getAllTextElementsController = async (req: Request, res: Response) => {
    try {
        const textElements = await getAllTextElementsService();
        return res.status(200).json({
            success: true,
            message: "Text elements retrieved successfully",
            data: textElements,
        });
    } catch (error) {
        logger.error("Error retrieving text elements: " + error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
