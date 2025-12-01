import { Request, Response } from "express";
import { getAllDiscountCodesService } from "../../services/discount_codes/getAllDiscountCodes.service";
import { errorResponse } from "../../services/error.service";

export const getAllDiscountCodesController = async (req: Request, res: Response) => {
    try {
        return await getAllDiscountCodesService(req, res);
    } catch (error: any) {
        return errorResponse(res, error);
    }
};
