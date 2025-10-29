// import "dotenv/config";
import { App } from "./app";

export const server = new App(process.env.EXPOSE_PORT as string);
server.listen();
