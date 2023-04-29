import mongoose from "mongoose";
import Admin from "../../models/Admin.js";
import jwt from "jsonwebtoken"
import { transporter } from "../../libs/nodemailer.js";


export const signup = async (req, res, next) => {
    try {
        const { password, email } = req.body
        const emailExist = await Admin.findOne({ email })
        if (emailExist) {
            return res.json({ message: "The email is already in use." })
        }
        else {
            if (password.length >= 6 && password.length < 16) {
                const user = new Admin({ password, email })
                user.password = await user.encryptPassword(user.password)
                const userSaved = await user.save()
                const token = jwt.sign({ _id: userSaved._id }, `${process.env.TOKEN_KEY_JWT}`, {
                    expiresIn: 1815000000
                })
                await user.save()
                res.status(200).json({ data: token})
            }
        }
    } catch (error) {
        console.log("error:", error)
        res.status(400).json(error)
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (email !== undefined && email.length > 0 && password.length > 0) {
            const user = await Admin.findOne({ email })
            if (!user) {
                throw new Error("No se encontró el usuario");
            }
            const passwordFromLogin = await user.validatePassword(password)
            if (!passwordFromLogin) return res.status(400).json('Contraseña incorrecta')
            const token = jwt.sign({ _id: user._id }, `${process.env.TOKEN_KEY_JWT}`, {
                expiresIn: 1815000000
            })
            res.status(200).json({ data: token })
            await user.save()
        }

    } catch (error) {
        console.log("error:", error)
        res.status(400).json(error)
        next(error)
    }
}

export const logout = async (req, res, next) => {
    try {
        const user = await Admin.findById(req.userId)
        if (!user) {
            throw new Error("No se encontró el usuario");
        }
        await user.save()

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
        next(error)
    }
}

export const reset = async (req, res, next) => {
    try {
        const { email } = req.body
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
            const user = await Admin.findById(req.userId)
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