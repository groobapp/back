import User from "../../models/User.js"
import Chat from "../../models/Chat.js"
import { transporter } from "../../libs/nodemailer.js";

export const addMessage = async (req, res, next) => {
    try {
        const { chatId, senderId, text, remitterId } = req.body;

        const newMessage = {
            sender: {
                senderId,
                texts: [{ text, date: new Date() }]
            },
            remitter: {
                remitterId,
                texts: [{ text, date: new Date() }]
            }
        };

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { messages: newMessage } },
            { new: true, runValidators: true }
        );

        if (!updatedChat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        const receiver = await User.findById(remitterId);
        if (receiver) {
            await transporter.sendMail({
                from: 'joeljuliandurand@gmail.com',
                to: `${receiver.email}`,
                subject: `Groobi: ¡Tienes nuevos mensajes!`,
                text: `Hola ${receiver.userName}, tienes nuevos mensajes, ingresa para verlos.`,
            });
        }

        res.status(200).json(newMessage);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
        next(error);
    }
}


export const getMessages = async (req, res, next) => {    
    try {
        const myId = req.userId?.toString()
        const { chatId } = req.params
        const chat = await Message.find({ chatId })
        res.status(200).json({ chat, myId })

    } catch (error) {
        console.log(error)
        res.status(400).json({error: error})
        next(error)
    }
}

