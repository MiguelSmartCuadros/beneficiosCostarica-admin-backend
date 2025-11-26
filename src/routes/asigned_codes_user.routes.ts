import { Router } from "express";
import { getAllAsignedCodesUserController } from "../controllers/asigned_codes_user/getAllAsignedCodesUser.controller";
import { verify_JWT } from "../middlewares/verifyToken";
import { isAdmin } from "../middlewares/isAdmin";

const asignedCodesUserRouter: Router = Router();

/**
 * @openapi
 * /asigned-codes-user/getall-asigned-codes:
 *   get:
 *     tags: [AsignedCodesUser]
 *     summary: Obtener todos los códigos asignados
 *     security:
 *       - x-access-token: []
 *     responses:
 *       200:
 *         description: Lista de códigos asignados obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                      asigned_codes:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: number
 *                                  store_id:
 *                                      type: number
 *                                  code_id:
 *                                      type: number
 *                                  document_number:
 *                                      type: string
 *                                  is_black:
 *                                      type: number
 *                                  date:
 *                                      type: string
 *                                      format: date
 *                      total:
 *                          type: number
 *                          description: Total de registros
 *       500:
 *         description: Error interno del servidor
 */
asignedCodesUserRouter.get("/getall-asigned-codes", verify_JWT, isAdmin, getAllAsignedCodesUserController);

export { asignedCodesUserRouter };
