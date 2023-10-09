import Message from "../../models/Message.js";
import User from "../../models/User.js"
import Chat from "../../models/Chat.js"
import { transporter } from "../../libs/nodemailer.js";
import { closeConnectionInMongoose } from "../../libs/constants.js";

export const addMessage = async (req, res, next) => {
    try {
        const { chatId, senderId, text } = req.body
        const newMessage = new Message({ chatId, senderId, text })
        const result = await newMessage.save()
        const chat = await Chat.findById(chatId)
        if (chat !== undefined) {
            chat.messages = chat.messages.concat(text)
        }
        await chat.save()
        const reciverId = chat?.members[1]
        const userReciverId = await User.findById(reciverId)
        await transporter.sendMail({
            from: 'joeljuliandurand@gmail.com', 
            to: `${userReciverId?.email}`, 
            subject: `Groob: ¡Tenés nuevos mensajes!`, 
            text: `Hola ${userReciverId?.userName} tenés nuevos mensajes, ingresá para verlo.`, 
            // html: "<b>Hello world?</b>", // html body
        });
        
        res.status(200).json(result)
        return closeConnectionInMongoose

    } catch (error) {
        console.error(error)
        res.status(500).json({error: error})
        next(error)
    }
}


export const getMessages = async (req, res, next) => {    
    try {
        const myId = req.userId?.toString()
        const { chatId } = req.params
        const chat = await Message.find({ chatId })
        res.status(200).json({ chat, myId })
        return closeConnectionInMongoose

    } catch (error) {
        console.log(error)
        res.status(400).json({error: error})
        next(error)
    }
}

