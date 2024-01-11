import { closeConnectionInMongoose } from '../../libs/constants.js';
import Chat from "../../models/Chat.js"
import User from "../../models/User.js"

export const createChat = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const chat = await Chat.findOne({
            members: { $all: [req.userId, req.body.recivedId] }
        });

        if (chat) {
            return res.status(200).json({ message: "El chat ya existe:", chat });
        }

        const newChat = new Chat({ members: [req.body.senderId, req.body.recivedId] });
        const result = await newChat.save();
        const chatId = result._id;

        user.chats = user.chats.concat(chatId);
        await user.save();

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ha ocurrido un error al crear el chat" });
        next(error);
    }
}


export const userChats = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        const chats = await Chat.find({
            members: { $in: [req.userId] }
        })


        const userName = user?.userName
        const profilePicture = user?.profilePicture?.secure_url
        const myId = user._id.toString()
        const role = user?.role
        const usersInMyChat = chats.map(obj => obj.members).flat()
        const usersId = usersInMyChat.filter(member => member !== myId)

        const allMyChats = await User.find({ // busco los usuarios con los que tengo chats
            _id: {
                $in: usersId
            }
        })

        const chatIdAndUserId = chats.map(user => { // para saber con quien es el chat
            return {
                id: user._id.toString(),
                member: user.members,
            }
        })

        const usersDataInTheChat = allMyChats.map(user => { // para renderizar los datos
            return {
                id: user._id.toString(),
                userName: user.userName,
                profilePicture: user.profilePicture.secure_url,
                // updatedAt: user.updatedAt,
            }
        })
        res.status(200).json({ chatIdAndUserId, usersDataInTheChat, userName, profilePicture, myId, role })

        return closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error })
        next(error)
    }
}


export const findChat = async (req, res, next) => {
    try {
        const myUser = await User.findById(req.userId)
        const myRole = myUser?.role
        const myId = req.userId?.toString()
        const chat = await Chat.findOne({
            members: { $all: [req.userId, req.params.secondId] }
        })
        const user = await User.findById(req.params.secondId)
        const userName = user?.userName
        const profilePicture = user?.profilePicture?.secure_url
        closeConnectionInMongoose
        res.status(200).json({ chat, userName, profilePicture, myId, myRole })

    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error })
        next(error)
    }
}

export const deleteChat = async (req, res, next) => {
    try {
        const myId = req.userId?.toString()
        const chat = await Chat.findByIdAndDelete({
            members: { $all: [req.userId, req.params.secondId] }
        })
        // añadir la eliminación de todos los mensajes en el chat
        closeConnectionInMongoose
        res.status(200).json("Chat deleted")

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
        next()
    }
}