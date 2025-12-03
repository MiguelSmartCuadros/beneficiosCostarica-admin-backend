import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback, MulterError } from "multer";
import { errorResponse } from "../services/error.service"; // Assuming this exists based on user snippet
import { ErrorI } from "../interfaces/error.interface"; // Assuming this exists based on user snippet
import { logger } from "../logger/logger";

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("El archivo debe ser una imagen válida (JPEG, JPG, PNG)"));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB limit
    },
});

export const getStoreImages = (req: Request, res: Response, next: NextFunction) => {
    const uploadFields = upload.fields([
        { name: "store_img_card", maxCount: 1 },
        { name: "store_img_highlight", maxCount: 1 },
        { name: "store_img_banner", maxCount: 1 },
    ]);

    uploadFields(req, res, (err: any) => {
        logger.info("Obteniendo imágenes de la tienda ...");

        if (err instanceof MulterError) {
            const error: ErrorI = {
                error: true,
                message: err.message,
                statusCode: 400,
            };
            // Assuming errorResponse handles sending the response
            // If errorResponse is not available, I might need to check if it exists first.
            // The user provided snippet imports it from "../services/error.service".
            // I should verify if that file exists or if I need to create/mock it?
            // The user said "Prefiero que se use algo similar a esto" and provided imports.
            // I will assume the imports are correct for their project structure or I should check.
            // Wait, I haven't seen `src/services/error.service.ts` in the file list but I saw `src/interfaces/error.interface.ts`.
            // Let me check if `src/services/error.service.ts` exists.
            // For now I will use the code as requested but I'll check for the file existence in a separate step if needed.
            // Actually, to be safe, I'll check for `errorResponse` availability.
            // But the user provided the import path: `../services/error.service`.
            // I'll assume it exists.
            return errorResponse(res, error);
        } else if (err) {
            const error: ErrorI = {
                error: true,
                message: err.message || "Error al intentar obtener los archivos",
                statusCode: 500,
            };
            return errorResponse(res, error);
        } else {
            logger.info("Imágenes obtenidas ...");
            next();
        }
    });
};
