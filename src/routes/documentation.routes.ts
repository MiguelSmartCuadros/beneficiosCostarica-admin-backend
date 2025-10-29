import { Router } from "express";
import swaggerUI from "swagger-ui-express";
import swaggerSetup from "../documentation/swagger";

const documentation = Router();

documentation.use("/", swaggerUI.serve, swaggerUI.setup(swaggerSetup));

export { documentation };