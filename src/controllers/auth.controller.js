import mongoose from "mongoose";
import User from "../models/User.js";
import jwt from "jsonwebtoken"
import { transporter } from "../libs/nodemailer.js";
// import { LoginBodyType, SignupBodyType } from "../schemas/auth..schema";


export const signup = async (req, res, next) => {
    try {
        const { userName, password, email } = req.body
        const userNameExist = await User.findOne({ userName })
        if (userNameExist) {
            return res.json({ message: "The username is already in use." })
        }
        const emailExist = await User.findOne({ email })
        if (emailExist) {
            return res.json({ message: "The email is already in use." })
        }
        else {
            if (password.length >= 6 && password.length < 16) {
                const user = new User({ userName, password, email })
                user.password = await user.encryptPassword(user.password)
                user.profilePicture.secure_url = "https://res.cloudinary.com/groob/image/upload/v1661108370/istoremovebg-preview_hzebg1.png"
                const userSaved = await user.save()
                const token = jwt.sign({ _id: userSaved._id }, `${process.env.TOKEN_KEY_JWT}`, {
                    expiresIn: 1815000000
                })
                user.online = true
                await user.save()
                // res.cookie('authtoken', token, {
                //     maxAge: 1815000000, //21 days
                //     httpOnly: true, // Para consumir sólo en protocolo HTTP
                //     sameSite: 'none',
                //     secure: true,
                // })
                await transporter.sendMail({
                    from: 'joeljuliandurand@gmail.com', // sender address
                    to: `${email}`, // list of receivers
                    subject: `Hola ${userName}, registro exitoso!`, // Subject line
                    text: "Gracias por registrarte. Groob es una plataforma creada por Joel Durand.", // plain text body
                    // html: "<b>Hello world?</b>", // html body
                });
                console.log(user)
                res.status(200).json({ message: 'Success', token: token })
            }
        }
    } catch (error) {
        console.log("error:", error)
        res.status(400).json(error)
        next()
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, userName, password } = req.body
        if (email !== undefined && email.length > 0 && password.length > 0) {
            const user = await User.findOne({ email })
            if (!user) {
                throw new Error("No se encontró el usuario");
            }
            const passwordFromLogin = await user.validatePassword(password)
            if (!passwordFromLogin) return res.status(400).json('Email or password is wrong')
            user.online = true
            const token = jwt.sign({ _id: user._id }, `${process.env.TOKEN_KEY_JWT}`, {
                expiresIn: 1815000000
            })
            // res.setHeader('Set-cookie', serialize("authtoken", token, {
            //     maxAge: 1815000000, //21 days
            //     httpOnly: true, 
            //     sameSite: 'none',
            //     secure: true,
            // }))
            res.status(200).json({ message: 'Success', token: token })
            await user.save()
        }

        if (userName !== undefined && userName.length > 0 && password.length > 0) {
            const user = await User.findOne({ userName })
            if (!user) {
                throw new Error("No se encontró el usuario");
            }
            const passwordFromLogin = await user.validatePassword(password)
            if (!passwordFromLogin) return res.status(400).json('Email or password is wrong')
            user.online = true
            const token = jwt.sign({ _id: user._id }, `${process.env.TOKEN_KEY_JWT}`, {
                expiresIn: 1815000000
            })
            // res.cookie('authtoken', token, {
            //     maxAge: 1815000000, //21 days
            //     httpOnly: true, 
            //     sameSite: 'none',
            //     secure: true,
            // })
            res.status(200).json({ message: 'Success', token: token })
            await user.save()
        }

    } catch (error) {
        console.log("error:", error)
        res.status(400).json(error)
        next()
    }
}

export const logout = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            throw new Error("No se encontró el usuario");
        }
        user.online = false
        await user.save()
        res.clearCookie('authtoken');
        res.send('Cookie deleted');
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
        next()
    }
}

// const htmlTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:arial, 'helvetica neue', helvetica, sans-serif"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title>New message</title><!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if !mso]><!-- --><link href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap" rel="stylesheet"><!--<![endif]--><style type="text/css">#outlook a {	padding:0;}.es-button {	mso-style-priority:100!important;	text-decoration:none!important;}a[x-apple-data-detectors] {	color:inherit!important;	text-decoration:none!important;	font-size:inherit!important;	font-family:inherit!important;	font-weight:inherit!important;	line-height:inherit!important;}.es-desk-hidden {	display:none;	float:left;	overflow:hidden;	width:0;	max-height:0;	line-height:0;	mso-hide:all;}[data-ogsb] .es-button {	border-width:0!important;	padding:10px 25px 10px 30px!important;}.es-button-border:hover a.es-button, .es-button-border:hover button.es-button {	background:#58dfec!important;	border-color:#58dfec!important;}.es-button-border:hover {	border-color:#26C6DA #26C6DA #26C6DA #26C6DA!important;	background:#58dfec!important;	border-style:solid solid solid solid!important;}@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px!important; text-align:center } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important; text-align:center } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:18px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }</style></head>
// <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><div class="es-wrapper-color" style="background-color:#07023C"><!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#07023c"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#07023C"><tr><td valign="top" style="padding:0;Margin:0"><table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr><td align="center" style="padding:0;Margin:0"><table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;background-repeat:no-repeat;width:600px;background-image:url(images/vector_0Ia.png);background-position:center center" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" background="images/vector_0Ia.png"><tr><td align="left" style="Margin:0;padding-bottom:10px;padding-top:20px;padding-left:20px;padding-right:20px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#26C6DA;font-size:14px"><img src="images/logo.png" alt="Logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" title="Logo" height="55"></a></td>
// </tr></table></td></tr></table></td></tr><tr><td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td class="es-m-p0r es-m-p20b" valign="top" align="center" style="padding:0;Margin:0;width:560px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"><br></p>
// <h1 style="Margin:0;line-height:53px;mso-line-height-rule:exactly;font-family:Orbitron, sans-serif;font-size:44px;font-style:normal;font-weight:bold;color:#10054D"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit">GROOB</font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></h1></td>
// </tr><tr><td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit">&nbsp;¿Olvidaste tu contraseña? </font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit">¡No hay problema!</font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></p>
// </td></tr><tr><td align="center" style="padding:0;Margin:0;padding-bottom:10px;padding-top:15px;font-size:0px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#26C6DA;font-size:14px"><img class="adapt-img" src="images/undraw_mobile_encryption_re_yw3o.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="300"></a></td>
// </tr><tr><td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px"><!--[if mso]><a href="https://viewstripo.email" target="_blank" hidden> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://viewstripo.email" style="height:44px; v-text-anchor:middle; width:275px" arcsize="23%" strokecolor="#26c6da" strokeweight="4px" fillcolor="#26c6da"> <w:anchorlock></w:anchorlock> <center style='color:#ffffff; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:18px; font-weight:400; line-height:18px; mso-text-raise:1px'>Restablecer contraseña</center> </v:roundrect></a><![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#26C6DA;background:#26C6DA;border-width:4px;display:inline-block;border-radius:10px;width:auto;mso-hide:all"><a href="https://viewstripo.email" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:20px;border-style:solid;border-color:#26C6DA;border-width:10px 25px 10px 30px;display:inline-block;background:#26C6DA;border-radius:10px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:24px;width:auto;text-align:center"><font style="vertical-align:inherit"><font style="vertical-align:inherit">Restablecer contraseña</font></font></a></span><!--<![endif]--></td>
// </tr><tr><td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit">Si ignora este mensaje, su contraseña no se cambiará.</font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></p>
// </td></tr></table></td></tr></table></td></tr></table></td>
// </tr></table><table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr><td align="center" style="padding:0;Margin:0"><table bgcolor="#10054D" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#10054d;width:600px"><tr><td align="left" background="images/vector_sSY.png" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:35px;padding-bottom:35px;background-image:url(images/vector_sSY.png);background-repeat:no-repeat;background-position:left center"><!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:69px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr><td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:69px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" class="es-m-txt-l" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#26C6DA;font-size:14px"><img src="images/logo.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="69"></a></td>
// </tr></table></td></tr></table><!--[if mso]></td><td style="width:20px"></td>
// <td style="width:471px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"><tr><td align="left" style="padding:0;Margin:0;width:471px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:0;Margin:0"><h3 style="Margin:0;line-height:34px;mso-line-height-rule:exactly;font-family:Orbitron, sans-serif;font-size:28px;font-style:normal;font-weight:bold;color:#ffffff"><b><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit">Groob.</font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></b></h3>
// </td></tr><tr><td align="left" style="padding:0;Margin:0;padding-bottom:5px;padding-top:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#ffffff;font-size:14px"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit">En caso de detectar errores podés responder a este email o contactar mediante el menú en la aplicación.</font></font></font></font></p></td></tr></table></td></tr></table><!--[if mso]></td></tr></table><![endif]--></td></tr></table></td>
// </tr></table><table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"><tr><td align="center" style="padding:0;Margin:0"><table class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"><tr><td align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0"><table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" valign="top" style="padding:0;Margin:0"><a target="_blank" href="https://instagram.com/groob.app" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img title="Instagram" src="images/instagram-square-colored.png" alt="Inst" width="32" height="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
// </tr></table></td>
// </tr><tr><td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;color:#ffffff;font-size:12px"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit">Groob es una plataforma iniciada por Julián Durand.&nbsp;</font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit">Asegúrese de que nuestros mensajes lleguen a su Bandeja de entrada (y no a sus carpetas masivas o de correo basura). </font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font><br><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:12px" href="https://viewstripo.email"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit">Politica de privacidad</font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></a><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"> | </font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:12px" href=""><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit"><font style="vertical-align:inherit">Darse de baja</font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></font></a></p>
// </td></tr></table></td></tr></table></td>
// </tr><tr><td align="left" style="padding:20px;Margin:0"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" valign="top" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" class="es-infoblock made_with" style="padding:0;Margin:0;line-height:120%;font-size:0;color:#CCCCCC"><a target="_blank" href="https://viewstripo.email/?utm_source=templates&utm_medium=email&utm_campaign=product_update_1&utm_content=it_happens_to_everyone" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"><img src="images/7911561025989373.png" alt width="125" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
// </tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div></body></html>`

export const reset = async (req, res, next) => {
    try {
        const { email, userName } = req.body
        console.log(email, userName)
        if (email !== undefined && email.length > 0) {
            const user = await User.findOne({ email })
            const token = jwt.sign({ _id: user._id }, `${process.env.TOKEN_KEY_JWT}`, {
                expiresIn: 900000
            })
            await transporter.sendMail({
                from: 'joeljuliandurand@gmail.com',
                to: `${user?.email}`,
                subject: `Recuperá tu contraseña.`,
                text: `Hola! Alguien solicitó recuperar la contraseña de ingreso. Si no fuiste vos, ignora este email por favor. Tenés 15 minutos para cambiar la contraseña. Accede desde el siguiente link: https://groob.com.ar/change-password?token=${token}`,
                // html: '<button> <a href=`https://www.groob.com.ar/reset-password/${token}`>Resetear contraseña</a></button>',
            });
            res.json({ success: true })

        }
        if (userName !== undefined && userName.length > 0) {
            const user = await User.findOne({ userName })
            const token = jwt.sign({ _id: user._id }, `${process.env.TOKEN_KEY_JWT}`, {
                expiresIn: 900000
            })
            // const verificationLink = `https://www.groob.com.ar/reset-password/${token}}`
            await transporter.sendMail({
                from: 'joeljuliandurand@gmail.com',
                to: `${user?.email}`,
                subject: `Recuperá tu contraseña.`,
                text: `Tenés 15 minutos para cambiar la contraseña, si el botón no funciona prueba copiar y pegar el siguiente link: https://groob.com.ar/change-password?token=${token}`,
                // html: '<button> <a href=`https://www.groob.com.ar/reset-password/${token}`>Resetear contraseña</a></button>',

            });
            res.json({ success: true })
        }
    } catch (error) {
        console.log(error)
        next(error);
    }
}

export const changePassword = async (req, res, next) => {
    try {
        const { password } = req.body
        console.log(password)
        if (password.length >= 6 && password.length <= 16) {
            const user = await User.findById(req.userId)
            console.log(user)
            user.password = await user.encryptPassword(password)
            await user.save()
            res.status(200).json("good")
        }
    } catch (error) {
        console.log(error)
        next(error);
    }
}