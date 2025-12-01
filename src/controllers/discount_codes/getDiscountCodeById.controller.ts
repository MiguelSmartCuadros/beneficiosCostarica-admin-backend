import { Request, Response } from "express";
import { getDiscountCodeByIdService } from "../../services/discount_codes/getDiscountCodeById.service";
import { errorResponse } from "../../services/error.service";

export const getDiscountCodeByIdController = async (req: Request, res: Response) => {
    try {
        return await getDiscountCodeByIdService(req, res);
    } catch (error: any) {
        return errorResponse(res, error);
    }
};
