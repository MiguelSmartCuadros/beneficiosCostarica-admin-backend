import nodemailer, { Transporter } from "nodemailer";

const { HOST_EMAIL, USER_EMAIL, PASSWORD_EMAIL } = process.env;

export const transporter: Transporter = nodemailer.createTransport({
  host: HOST_EMAIL,
  port: 465,
  secure: true,
  pool: true,
  maxConnections: 10,
  maxMessages: 100,
  auth: {
    user: USER_EMAIL,
    pass: PASSWORD_EMAIL,
  },
});