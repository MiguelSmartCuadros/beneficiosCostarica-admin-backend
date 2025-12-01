import { Request, Response } from "express";
import { deleteDiscountCodeService } from "../../services/discount_codes/deleteDiscountCode.service";
import { errorResponse } from "../../services/error.service";

export const deleteDiscountCodeController = async (req: Request, res: Response) => {
    try {
        return await deleteDiscountCodeService(req, res);
    } catch (error: any) {
        return errorResponse(res, error);
    }
};
