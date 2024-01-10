import User from "../../models/User.js";
import Wallet from "../../models/Wallet.js";
import jwt from "jsonwebtoken"
import { transporter } from "../../libs/nodemailer.js";


export const signup = async (req, res, next) => {
    try {
        const { userName, password, email } = req.body
        const userNameExist = await User.findOne({ userName })
        if (userNameExist) {
            return res.status(400).json({ message: "El nombre de usuario está en uso." })
        }
        const emailExist = await User.findOne({ email })
        if (emailExist) {
            return res.status(400).json({ message: "El email se encuentra en uso." })
        }
        if (password.length >= 6 && password.length < 16) {
            const user = new User({ userName, password, email })
            user.password = await user.encryptPassword(user.password)
            user.profilePicture.secure_url = "https://res.cloudinary.com/groob/image/upload/v1661108370/istoremovebg-preview_hzebg1.png"
            const userSaved = await user.save()

            const token = jwt.sign({ _id: userSaved._id }, `${process.env.TOKEN_KEY_JWT}`, {
                expiresIn: 1815000000
            })
            const wallet = new Wallet({
                user: userSaved._id
            });
            const walletSaved = await wallet.save();
            userSaved.wallet = walletSaved._id;
            await userSaved.save();

            await transporter.sendMail({
                from: 'joeljuliandurand@gmail.com',
                to: `${email}`,
                subject: `Hola ${userName}, registro exitoso!`,
                text: "Gracias por registrarte. Groob es una plataforma creada por Joel Durand. Ante cualquier duda puedes consultar por este medio.", // plain text body
                // html: "<b>Hello world?</b>", // html body
            });
            res.status(200).json({ token })
        }

    } catch (error) {
        console.log("Error: ", error)
        res.status(500).json(error)
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, userName, password } = req.body
        if (email !== undefined && email.length > 0 && password.length > 0) {
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: 'Usuario no encontrado.' })
            }
            const passwordFromLogin = await user.validatePassword(password)
            if (!passwordFromLogin) return res.status(400).json({ message: 'Email o contraseña incorrectos' })
            const token = jwt.sign({ _id: user._id }, `${process.env.TOKEN_KEY_JWT}`, {
                expiresIn: 1815000000
            })
            res.status(200).json({ token })
        }

        if (userName !== undefined && userName.length > 0 && password.length > 0) {
            const user = await User.findOne({ userName })
            if (!user) {
                return res.status(400).json({ message: 'Usuario no encontrado.' })
            }
            const passwordFromLogin = await user.validatePassword(password)
            if (!passwordFromLogin) return res.status(400).json('Email o contraseña incorrectos')
            const token = jwt.sign({ _id: user._id }, `${process.env.TOKEN_KEY_JWT}`, {
                expiresIn: 1815000000
            })
            res.status(200).json({ token })
        }
    } catch (error) {
        console.log("error:", error)
        res.status(500).json(error)
        next(error)
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
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).json(error)
        next(error)
    }
}


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
                text: `Hola! Alguien solicitó recuperar la contraseña de ingreso. Si no fuiste vos, ignora este email por favor. Tenés 15 minutos para cambiar la contraseña. Accede desde el siguiente link: https://groob.app/change-password?token=${token}`,
                // html: '<button> <a href=`https://www.groob.app/reset-password/${token}`>Resetear contraseña</a></button>',
            });
            res.json({ success: true })

        }
        if (userName !== undefined && userName.length > 0) {
            const user = await User.findOne({ userName })
            const token = jwt.sign({ _id: user._id }, `${process.env.TOKEN_KEY_JWT}`, {
                expiresIn: 900000
            })
            // const verificationLink = `https://www.groob.app/reset-password/${token}}`
            await transporter.sendMail({
                from: 'joeljuliandurand@gmail.com',
                to: `${user?.email}`,
                subject: `Recuperá tu contraseña.`,
                text: `Tenés 15 minutos para cambiar la contraseña, si el botón no funciona prueba copiar y pegar el siguiente link: https://groob.app/change-password?token=${token}`,
                // html: '<button> <a href=`https://www.groob.app/reset-password/${token}`>Resetear contraseña</a></button>',

            });
            res.json({ "success": true })
        }
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).json(error)
        next(error)
    }
}

export const changePassword = async (req, res, next) => {
    try {
        const { password } = req.body
        if (!password) {
            return res.status(400).json("No se recibió ninguna contraseña.")
        }
        if (password.length >= 6 && password.length <= 16) {
            const user = await User.findById(req.userId)
            user.password = await user.encryptPassword(password)
            await user.save()
            return res.status(200).json({ "success": true })
        }
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).json(error)
        next(error)
    }
}