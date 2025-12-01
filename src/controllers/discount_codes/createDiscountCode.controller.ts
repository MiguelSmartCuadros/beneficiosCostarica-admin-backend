import { Request, Response } from "express";
import { createDiscountCodeService } from "../../services/discount_codes/createDiscountCode.service";
import { errorResponse } from "../../services/error.service";

export const createDiscountCodeController = async (req: Request, res: Response) => {
    try {
        return await createDiscountCodeService(req, res);
    } catch (error: any) {
        return errorResponse(res, error);
    }
};
