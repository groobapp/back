import nodemailer from "nodemailer"
import { NODEMAILER_USER_AUTH, NODEMAILER_PASS_AUTH } from "../config.js";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
    secure: true,
    service: 'gmail',
    auth: {
      user: NODEMAILER_USER_AUTH,
      pass: NODEMAILER_PASS_AUTH,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
