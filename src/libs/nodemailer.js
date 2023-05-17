import nodemailer from "nodemailer";
import { NODEMAILER_USER_AUTH, NODEMAILER_PASS_AUTH } from "../config.js";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false, // Utilizar "false" para el puerto 587
  auth: {
    user: NODEMAILER_USER_AUTH,
    pass: NODEMAILER_PASS_AUTH,
  },
  tls: {
    rejectUnauthorized: false,
  },
});