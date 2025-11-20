import { Router } from "express";
import swaggerUI from "swagger-ui-express";
import swaggerSetup from "../documentation/swagger";

const documentation = Router();

const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0 }
  `,
  customSiteTitle: "Beneficios Costa Rica - API Documentation",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
};

documentation.use("/", swaggerUI.serve, swaggerUI.setup(swaggerSetup, swaggerOptions));

export { documentation };