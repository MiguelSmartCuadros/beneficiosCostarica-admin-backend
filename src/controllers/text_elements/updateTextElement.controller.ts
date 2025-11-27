import { Request, Response } from "express";
import { updateTextElementService } from "../../services/text_elements/updateTextElement.service";
import { logger } from "../../logger/logger";

export const updateTextElementController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const textElementData = req.body;
        const updatedTextElement = await updateTextElementService(Number(id), textElementData);

        if (!updatedTextElement) {
            return res.status(404).json({
                success: false,
                message: "Text element not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Text element updated successfully",
            data: updatedTextElement,
        });
    } catch (error) {
        logger.error("Error updating text element: " + error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
