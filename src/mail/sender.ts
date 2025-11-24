import { SendMailOptions, SentMessageInfo } from "nodemailer";
import { transporter } from "./mailer.config";
import { logger } from "../logger/logger";
import { readFile } from "fs/promises";
import { handlerTemplate } from "./templates/handler/handlerEmailTemplate";
import { ErrorI } from "../interfaces/error.interface";
import { sendMessageWebSocket } from "../websocket/websocket_server";
import path from "path";

const { EMAIL } = process.env;

export const sendEmail: (destinatario: string, replacements: any, websocket_id?: string | undefined) => Promise<boolean | ErrorI> = async (
  destinatario: string,
  replacements: any,
  websocket_id?: string | undefined
) => {
  if (websocket_id) sendMessageWebSocket(websocket_id, { loading_company_affiliates: `Enviando correo a ${destinatario}` });
  const templatePath = path.join(process.cwd(), "src", "mail", "templates", "password_reset_template.html");
  const htmlContent: string = await readFile(templatePath, "utf-8");

  const stringHtmlToSend: string = handlerTemplate(htmlContent, replacements);

  const mailOptions: SendMailOptions = {
    from: EMAIL,
    to: destinatario,
    subject: "Corporativo | SmartFit",
    html: stringHtmlToSend,
    attachments: [
      {
        filename: "logo.png",
        path: path.join(process.cwd(), "src", "mail", "templates", "assets", "logoSmartFit.png"),
        cid: "logo",
      },
      {
        filename: "footer.png",
        path: path.join(process.cwd(), "src", "mail", "templates", "assets", "footer.png"),
        cid: "footer",
      },
    ],
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
      if (error) {
        logger.error(`Error al enviar correo a ${destinatario}: ${error.message}`);
        const rejectError: ErrorI = {
          error: true,
          message: `Error al enviar correo a ${destinatario}. ${error.message}`,
          statusCode: 500,
        };
        if (websocket_id) sendMessageWebSocket(websocket_id, { loading_company_affiliates: rejectError.message });
        reject(rejectError);
      } else {
        logger.info(`Correo enviado a ${destinatario}`);
        if (websocket_id) sendMessageWebSocket(websocket_id, { loading_company_affiliates: `Correo enviado a ${destinatario}` });
        resolve(true);
      }
    });
  });
};

/**
 * Envía un email de recuperación de contraseña con código de verificación y enlace
 */
export const sendPasswordResetEmail = async (
  to: string,
  resetToken: string,
  username: string,
): Promise<boolean> => {
  try {
    if (!EMAIL) {
      throw new Error("La variable de entorno EMAIL no está definida");
    }

    // Leer el template HTML desde el archivo
    const templatePath = path.join(process.cwd(), "src", "mail", "templates", "password_reset_template.html");
    const htmlContent: string = await readFile(templatePath, "utf-8");

    // Generar el enlace de reseteo
    // Generar el enlace de reseteo
    const resetLink = `${process.env.URL_DOMAIN_SMARTFIT || "http://localhost:3000"}/reset-password/${resetToken}`;

    // Reemplazar las variables en el template usando Handlebars
    const stringHtmlToSend: string = handlerTemplate(htmlContent, {
      username,
      resetLink,
      currentYear: new Date().getFullYear(),
    });

    const mailOptions: SendMailOptions = {
      from: `"Beneficios Costa Rica Admin" <${EMAIL}>`,
      to,
      subject: "Recuperación de Contraseña - Beneficios Costa Rica Admin",
      html: stringHtmlToSend,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
        if (error) {
          logger.error(`Error al enviar email de recuperación de contraseña a ${to}: ${error.message}`);
          reject(error);
        } else {
          logger.info(`Email de recuperación de contraseña enviado exitosamente a: ${to} | MessageId: ${info.messageId}`);
          resolve(true);
        }
      });
    });
  } catch (error: any) {
    logger.error(`Error al enviar email de recuperación de contraseña: ${error.message}`);
    throw error;
  }
};
