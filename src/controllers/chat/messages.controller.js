import Message from "../../models/Message.js";
import User from "../../models/User.js"
import Chat from "../../models/Chat.js"
import { closeConnectionInMongoose } from "../../libs/constants.js";

export const addMessage = async (req, res, next) => {
    try {
        const { chatId, senderId, text } = req.body
        const user = await User.findById(req.userId)
        const role = user?.role
        const newMessage = new Message({ chatId, senderId, text, role })
        const result = await newMessage.save()
        const chat = await Chat.findById(chatId)
        if (chat !== undefined) {
            chat.messages = chat.messages.concat(text)
        }
        
        await chat.save()
        closeConnectionInMongoose
        res.status(200).json(result)

    } catch (error) {
        console.error(error)
        res.status(500).json(error)
        next()
    }
}


export const getMessages = async (req, res, next) => {    
    try {
        const myId = req.userId?.toString()
        const user = await User.findById(req.userId)
        const role = user?.role
        const { chatId } = req.params
        const chat = await Message.find({ chatId })


        closeConnectionInMongoose
        res.status(200).json({ chat, myId, role })

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
        next()
    }
}

