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

// transporter.verify()
// .then((loquehaya) => {
//   console.log("connected to SMTP server")
//   console.log(loquehaya)
// })
// .catch((error) => {
//   console.log("failed to connect to SMTP server")
//   console.log(error)
// })

// export const sendMail = async ({email, userName}) => {
//   console.log(email, userName)
//     try {
//       let info = await transporter.sendMail({
//         from: 'joeljuliandurand@gmail.com', // sender address
//         to: `${email}`, // list of receivers
//         subject: `Hola ${userName}, registro exitoso!`, // Subject line
//         text: "Hello world?", // plain text body
//         html: "<b>Hello world?</b>", // html body
//       });
//       return console.log({info, "enviado": true})
//     } catch (error) {
//       console.log(error);
//     }
//   }
// usuario registrado

// resetear contraseña

// contacto comercial

