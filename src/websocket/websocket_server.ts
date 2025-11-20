import { Server, WebSocket } from "ws";
import http from "http";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../logger/logger";

const clients: Map<string, WebSocket> = new Map();

export const createWebsocketServer = (http_server: http.Server): void => {
  try {
    const wss = new Server({ server: http_server, path: "/WebServicesSite" });

    wss.on("connection", (ws: WebSocket) => {
      let client_uuid = uuidv4();
      // console.log(ws);

      clients.set(client_uuid, ws);

      ws.on("close", () => {
        clients.delete(client_uuid);
      });
      ws.send(JSON.stringify({ id: client_uuid }), error => {
        if (error) {
          logger.error("Error al enviar el mensaje por websocket al cliente: " + error.message);
          throw new Error(`${error}`);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

export const sendMessageWebSocket = (wsId: string, data: any) => {
  let ws = clients.get(wsId);
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify({ data }), error => {
      if (error) {
        logger.error("Error al enviar el mensaje por websocket al cliente: " + error.message);
      }
    });
  } else {
    logger.error("WebSocket no está abierto o no se encontró el cliente");
  }
};
