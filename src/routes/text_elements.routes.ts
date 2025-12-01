import { Router } from "express";
import { createTextElementController } from "../controllers/text_elements/createTextElement.controller";
import { getAllTextElementsController } from "../controllers/text_elements/getAllTextElements.controller";
import { getTextElementByIdController } from "../controllers/text_elements/getTextElementById.controller";
import { updateTextElementController } from "../controllers/text_elements/updateTextElement.controller";
import { deleteTextElementController } from "../controllers/text_elements/deleteTextElement.controller";
import { verify_JWT } from "../middlewares/verifyToken";
import { isAdmin } from "../middlewares/isAdmin";
import { sanitizeHtmlContent } from "../middlewares/sanitizeHtml";

const textElementsRouter: Router = Router();

/**
 * @openapi
 * tags:
 *   name: Text Elements
 *   description: API para la gestión de elementos de texto de las tiendas
 */

/**
 * @openapi
 * /text-elements/getall-text-elements:
 *   get:
 *     summary: Obtener todos los elementos de texto
 *     tags: [Text Elements]
 *     security:
 *       - x-access-token: []
 *     responses:
 *       200:
 *         description: Lista de elementos de texto obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/text_elements'
 *       500:
 *         description: Error interno del servidor
 */
textElementsRouter.get("/getall-text-elements", verify_JWT, isAdmin, getAllTextElementsController);

/**
 * @openapi
 * /text-elements/get-text-element/{id}:
 *   get:
 *     summary: Obtener un elemento de texto por su ID
 *     tags: [Text Elements]
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del elemento de texto
 *     responses:
 *       200:
 *         description: Elemento de texto obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/text_elements'
 *       404:
 *         description: Elemento de texto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
textElementsRouter.get("/get-text-element/:id", verify_JWT, isAdmin, getTextElementByIdController);

/**
 * @openapi
 * /text-elements/create-text-element:
 *   post:
 *     summary: Crear un nuevo elemento de texto
 *     tags: [Text Elements]
 *     security:
 *       - x-access-token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/text_elements'
 *     responses:
 *       201:
 *         description: Elemento de texto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/text_elements'
 *       500:
 *         description: Error interno del servidor
 */
textElementsRouter.post("/create-text-element", verify_JWT, isAdmin, sanitizeHtmlContent, createTextElementController);

/**
 * @openapi
 * /text-elements/update-text-element/{id}:
 *   put:
 *     summary: Actualizar un elemento de texto
 *     tags: [Text Elements]
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del elemento de texto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/text_elements'
 *     responses:
 *       200:
 *         description: Elemento de texto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/text_elements'
 *       404:
 *         description: Elemento de texto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
textElementsRouter.put("/update-text-element/:id", verify_JWT, isAdmin, sanitizeHtmlContent, updateTextElementController);

/**
 * @openapi
 * /text-elements/delete-text-element/{id}:
 *   delete:
 *     summary: Eliminar un elemento de texto
 *     tags: [Text Elements]
 *     security:
 *       - x-access-token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del elemento de texto
 *     responses:
 *       200:
 *         description: Elemento de texto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Elemento de texto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
textElementsRouter.delete("/delete-text-element/:id", verify_JWT, isAdmin, deleteTextElementController);

export { textElementsRouter };
