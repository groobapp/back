import Chat from "../../models/Chat.js"
import User from "../../models/User.js"

export const createChat = async (req, res, next) => {
    try {
        const {recivedId, senderId} = req.body
        console.log("id usuarios", {recivedId, senderId})
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const chat = await Chat.findOne({
            members: { $all: [req.userId, recivedId] }
        });

        if (chat) {
            return res.status(200).json({ message: "El chat ya existe:", chat });
        }

        const newChat = new Chat({ members: [senderId, recivedId] });
        const result = await newChat.save();
        const chatId = result._id;

        user.chats = user.chats.concat(chatId);
        await user.save();

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ha ocurrido un error al crear el chat", error });
        next(error);
    }
}


export const userChats = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const chats = await Chat.find({
            members: { $in: [req.userId] }
        }).lean();
        console.log("1 chats", chats)

        const usersId = [...new Set(chats.flatMap(chat => chat.members.filter(member => member !== req.userId)))];

        const allMyChats = await User.find({
            _id: { $in: usersId }
        }).lean();

        console.log("2 allMyChats", allMyChats)

        const usersDataInTheChat = allMyChats.map(user => {
            const chat = chats.find(chat => chat.members.includes(user._id.toString()));
            return {
                chatId: chat._id.toString(),
                id: user._id.toString(),
                userName: user.userName,
                profilePicture: user.profilePicture.secure_url || null,
                receiveVideocall: user.receiveVideocall,
                updatedAt: user.updatedAt,
            };
        });

        console.log("3 usersDataInTheChat", usersDataInTheChat)
        res.status(200).json({ usersDataInTheChat });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ha ocurrido un error al procesar los chats", errorDetail: error });
        next(error)
    }
};



export const findChat = async (req, res, next) => {
    try {
        const chat = await Chat.findOne({
            members: { $all: [req.userId, req.params.secondId] }
        })
        const user = await User.findById(req.params.secondId)
        const userName = user?.userName
        const profilePicture = user?.profilePicture?.secure_url || null
        res.status(200).json({ chat, userName, profilePicture})

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
        res.status(200).json("Chat deleted")

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
        next()
    }
}