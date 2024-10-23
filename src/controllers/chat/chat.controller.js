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
        const chats = await Chat.find({
            members: { $in: [req.userId] }
        });

        const usersInMyChat = chats.map(obj => obj.members).flat();
        const usersId = usersInMyChat.filter(member => member !== user._id);

        const usersExistingOnAllMyChats = await User.find({
            _id: {
                $in: usersId
            }
        });

        const userIdToChatsMap = {};
        chats.forEach(chat => {
            chat.members.forEach(memberId => {
                if (!userIdToChatsMap[memberId]) {
                    userIdToChatsMap[memberId] = [];
                }
                userIdToChatsMap[memberId].push(chat._id.toString());
            });
        });

        const usersDataInTheChat = usersExistingOnAllMyChats.map(user => ({
            id: user._id.toString(),
            userName: user.userName,
            profilePicture: user.profilePicture?.secure_url || null, 
            receiveVideocall: user.receiveVideocall,
            updatedAt: user.updatedAt,
            chatIds: userIdToChatsMap[user._id.toString()] || [] 
        }));

        res.status(200).json(usersDataInTheChat);

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error al obtener el listado de chats", error: error });
        next(error);
    }
};



export const findChat = async (req, res, next) => {
    // Recibe el segundo id como params, que es quien recibe los msjs
    // Con esos datos se pinta el Header de la conversación
    // y se renderizan los msjs
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