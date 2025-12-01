import { Router } from "express";
import { verify_JWT } from "../middlewares/verifyToken";
import { isAdmin } from "../middlewares/isAdmin";
import { createDiscountCodeController } from "../controllers/discount_codes/createDiscountCode.controller";
import { getAllDiscountCodesController } from "../controllers/discount_codes/getAllDiscountCodes.controller";
import { getDiscountCodeByIdController } from "../controllers/discount_codes/getDiscountCodeById.controller";
import { updateDiscountCodeController } from "../controllers/discount_codes/updateDiscountCode.controller";
import { deleteDiscountCodeController } from "../controllers/discount_codes/deleteDiscountCode.controller";

const discountCodesRouter: Router = Router();

/**
 * @openapi
 * /discount-codes/getall-discount-codes:
 *   get:
 *     tags: [Discount Codes]
 *     summary: Obtener todos los códigos de descuento
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Lista de códigos de descuento obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 discountCodes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/discount_codes'
 *                 total:
 *                   type: integer
 *                   description: Total de códigos de descuento
 *                 page:
 *                   type: integer
 *                   description: Página actual
 *                 totalPages:
 *                   type: integer
 *                   description: Total de páginas
 *       401:
 *         description: Acceso denegado
 *       500:
 *         description: Error interno del servidor
 */
discountCodesRouter.get("/getall-discount-codes", verify_JWT, isAdmin, getAllDiscountCodesController);

/**
 * @openapi
 * /discount-codes/get-discount-code/{id}:
 *   get:
 *     tags: [Discount Codes]
 *     summary: Obtener un código de descuento por su ID
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del código de descuento
 *     responses:
 *       200:
 *         description: Código de descuento obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 discountCode:
 *                   $ref: '#/components/schemas/discount_codes'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Acceso denegado
 *       404:
 *         description: Código de descuento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
discountCodesRouter.get("/get-discount-code/:id", verify_JWT, isAdmin, getDiscountCodeByIdController);

/**
 * @openapi
 * /discount-codes/create-discount-code:
 *   post:
 *     tags: [Discount Codes]
 *     summary: Crear un nuevo código de descuento
 *     security:
 *       - x-access-token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - store_id
 *               - codes
 *             properties:
 *               store_id:
 *                 type: integer
 *                 description: ID de la tienda
 *                 example: 1
 *               codes:
 *                 type: string
 *                 description: Código de descuento
 *                 maxLength: 45
 *                 example: "SMARTFIT2025"
 *     responses:
 *       201:
 *         description: Código de descuento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Código de descuento creado exitosamente"
 *                 discountCode:
 *                   $ref: '#/components/schemas/discount_codes'
 *       400:
 *         description: Datos de entrada inválidos o inexistentes
 *       401:
 *         description: Acceso denegado
 *       404:
 *         description: Tienda no encontrada
 *       500:
 *         description: Error interno del servidor
 */
discountCodesRouter.post("/create-discount-code", verify_JWT, isAdmin, createDiscountCodeController);

/**
 * @openapi
 * /discount-codes/update-discount-code/{id}:
 *   put:
 *     tags: [Discount Codes]
 *     summary: Actualizar un código de descuento
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del código de descuento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               store_id:
 *                 type: integer
 *                 description: ID de la tienda
 *                 example: 1
 *               codes:
 *                 type: string
 *                 description: Código de descuento
 *                 maxLength: 45
 *                 example: "SMARTFIT2025"
 *     responses:
 *       200:
 *         description: Código de descuento actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Código de descuento actualizado exitosamente"
 *                 discountCode:
 *                   $ref: '#/components/schemas/discount_codes'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Acceso denegado
 *       404:
 *         description: Código de descuento o tienda no encontrado
 *       500:
 *         description: Error interno del servidor
 */
discountCodesRouter.put("/update-discount-code/:id", verify_JWT, isAdmin, updateDiscountCodeController);

/**
 * @openapi
 * /discount-codes/delete-discount-code/{id}:
 *   delete:
 *     tags: [Discount Codes]
 *     summary: Eliminar un código de descuento
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del código de descuento
 *     responses:
 *       200:
 *         description: Código de descuento eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Código de descuento eliminado exitosamente"
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Acceso denegado
 *       404:
 *         description: Código de descuento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
discountCodesRouter.delete("/delete-discount-code/:id", verify_JWT, isAdmin, deleteDiscountCodeController);

export { discountCodesRouter };
