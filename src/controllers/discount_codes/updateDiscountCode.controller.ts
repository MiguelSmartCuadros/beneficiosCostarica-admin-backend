import { Request, Response } from "express";
import { updateDiscountCodeService } from "../../services/discount_codes/updateDiscountCode.service";
import { errorResponse } from "../../services/error.service";

export const updateDiscountCodeController = async (req: Request, res: Response) => {
    try {
        return await updateDiscountCodeService(req, res);
    } catch (error: any) {
        return errorResponse(res, error);
    }
};
