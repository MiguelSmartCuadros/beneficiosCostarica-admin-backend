import { Request, Response } from "express";
import { createTextElementService } from "../../services/text_elements/createTextElement.service";
import { logger } from "../../logger/logger";

export const createTextElementController = async (req: Request, res: Response) => {
    try {
        const textElementData = req.body;
        const newTextElement = await createTextElementService(textElementData);
        return res.status(201).json({
            success: true,
            message: "Text element created successfully",
            data: newTextElement,
        });
    } catch (error) {
        logger.error("Error creating text element: " + error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
