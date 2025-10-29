import { server } from "../index";

import Router from "express";
import { Request, Response } from "express";
import { logger } from "../logger/logger";

const projectInfo = Router();

/**
 * @swagger
 * /projectInfo:
 *   get:
 *     tags:
 *       - ProjectInfo
 *     summary: "Obtener la información del proyecto"
 *     description: "Este endpoint permite obtener la información del proyecto, incluyendo la versión y los datos de desarrollo."
 *     responses:
 *       200:
 *         description: "Documentación recuperada con éxito"
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *               ProjectName:
 *                type: string
 *                description: "Nombre del proyecto"
 *               ProjectDescription:
 *                type: string
 *                description: "Descripción del proyecto"
 *               ProjectCompany:
 *                type: string
 *                description: "Empresa del proyecto"
 *               ProjectDeveloper:
 *                type: string
 *                description: "Desarrollador del proyecto"
 *               ProjectDeveloperEmail:
 *                type: string
 *                description: "Correo del desarrollador"
 *               ProjectVersion:
 *                type: string
 *                description: "Versión del proyecto"
 *       404:
 *         description: "No se pudo obtener la información"
 *       500:
 *         description: "Error interno del servidor"
 */
projectInfo.get(
  "/",
  async (_req: Request, res: Response): Promise<Response> => {
    const getProjectInfo = server;
    logger.info(_req);
    return res.status(200).json(await getProjectInfo.projectInfo());
  }
);

export { projectInfo };
