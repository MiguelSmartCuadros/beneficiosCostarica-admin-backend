import { Request, Response } from "express";
import { deleteTextElementService } from "../../services/text_elements/deleteTextElement.service";
import { logger } from "../../logger/logger";

export const deleteTextElementController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await deleteTextElementService(Number(id));

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Text element not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Text element deleted successfully",
        });
    } catch (error) {
        logger.error("Error deleting text element: " + error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
