import { Request, Response } from "express";
import { getTextElementByIdService } from "../../services/text_elements/getTextElementById.service";
import { logger } from "../../logger/logger";

export const getTextElementByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const textElement = await getTextElementByIdService(Number(id));

        if (!textElement) {
            return res.status(404).json({
                success: false,
                message: "Text element not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Text element retrieved successfully",
            data: textElement,
        });
    } catch (error) {
        logger.error("Error retrieving text element: " + error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
