import { createLogger, transports, format, log } from "winston";

const date = new Date();
const nameLog = date.toLocaleDateString().replace(/\//g, "-");
console.log(date.toDateString().split(" ")[1]);

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      try {
        if (typeof message === "object") {
          message = JSON.stringify(message);
        }
      } catch (error) {
        logger.error(error);
      }
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: `./src/logger/info/${date.getFullYear()}/${
        date.toDateString().split(" ")[1]
      }/info-${nameLog}.log`,
      maxsize: 5120000,
    }),
    new transports.File({
      filename: `./src/logger/errors/${date.getFullYear()}/${
        date.toDateString().split(" ")[1]
      }/error-${nameLog}.log`,
      level: "error",
    }),
  ],
});
