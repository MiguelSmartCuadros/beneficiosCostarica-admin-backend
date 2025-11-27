import express, { json, Application, Request, Response } from "express";
import pkgjson from "../package.json";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { dbConnection } from "./connections/dbConnection";
import { modelRelations } from "./connections/modelRelations";
import { router } from "./routes/index.routes";
import { ProjectInfoI } from "./interfaces/projectInfo.interface";
import { logger } from './logger/logger';
import { errorHandler } from "./middlewares/errorHandler";

export class App {
    public app: Application;
    private server!: http.Server;
    constructor(private port?: number | string) {
        this.app = express();
        this.startApp();
    }

    public async startApp() {
        try {
            this.settings();
            this.middlewares();
            await this.routes();
            await this.dbConnection();
            this.relationSync();
        } catch (error) {
            logger.error(`${error}`);
        }
    }

    private async settings(): Promise<string> {
        this.app.set("port", process.env.EXPOSE_PORT || this.port || 3000);
        logger.info(this.app.get("port"));
        this.app.set("pkgjson", pkgjson);

        return this.app.get("port") as string;
    }

    private corsSettings(): void {
        // Configurar CORS para permitir varios orígenes
        const allowedOrigins = `${process.env.ALLOWED_ORIGINS}`
            .split(",")
            .map((origin) => {
                // const escapedOrigin = origin.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
                // return new RegExp(`^https?:\\/\\/([a-zA-Z0-9-]+\\.)?${escapedOrigin}(:\\d+)?(\\/.*)?$`);
                return new RegExp(`${origin}`);
            });
        const corsOptions: cors.CorsOptions = {
            origin: (
                origin: string | undefined,
                callback: (arg0: Error | null, arg1: boolean) => void
            ) => {
                const isAllowed = allowedOrigins.some((pattern) =>
                    pattern.test(origin || "")
                );
                logger.info(
                    `This origin ${origin} is ${isAllowed || !origin ? "allowed" : "not allowed"
                    }`
                );
                if (!origin) return callback(null, true);
                if (!isAllowed) {
                    return callback(
                        new Error(`Error, Unauthorized by cors origin: ${origin}`),
                        false
                    );
                }
                return callback(null, isAllowed);
            },
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Métodos permitidos
            allowedHeaders: [
                "Content-Type",
                "Authorization",
                "x-access-token",
                "Websocket_id",
            ], // Cabeceras permitidas
            optionsSuccessStatus: 204, // Asegura que las respuestas preflight OPTIONS devuelvan 204
            maxAge: 86400, // Tiempo de vida del preflight en segundos (1 día)
        };
        this.app.use(cors(corsOptions));
    }

    public async projectInfo(): Promise<ProjectInfoI> {
        const pkgjson = await this.app.get("pkgjson");
        return {
            projectName: pkgjson.name,
            projectDescription: pkgjson.description,
            projectCompany: pkgjson.company,
            projectDeveloper: pkgjson.developer,
            projectDeveloperEmail: pkgjson.email,
            projectVersion: pkgjson.version,
        };
    }

    private middlewares(): void {
        this.corsSettings();
        this.app.use(morgan("dev"));
        this.app.use(json());
        this.errorHandlingMiddleware();
    }

    listen(): void {
        this.server = this.app.listen(this.app.get("port"));
        logger.info("Server on port: " + this.app.get("port"));
    }

    private async dbConnection(): Promise<void> {
        await dbConnection.authenticate();
        logger.info(`Database connected`);
    }

    private relationSync(): void {
        modelRelations();
    }

    private async routes(): Promise<void> {
        this.app.use("/WebServices", router);

        // Respuesta controlada para rutas no encontradas. ¡SIEMPRE AL FINAL DE LAS RUTAS!
        router.use((req: Request, res: Response) => {
            res.status(404).json({
                error: true,
                message: `Route: ${req.url} Not Found`,
                statusCode: "404",
            });
        });
    }

    private errorHandlingMiddleware(): void {
        this.app.use(errorHandler);
    }

    public async stopApp(): Promise<void> {
        this.server.close();
        logger.info("Server stopped");
    }
}
