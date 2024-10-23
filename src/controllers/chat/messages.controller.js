import Chat from "../../models/Chat.js"

export const addMessage = async (req, res, next) => {
    try {
        const { chatId, senderId, remitterId, text } = req.body;

        const newMessage = {
            senderId,
            remitterId,
            text,
            date: new Date()
        };

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { messages: newMessage } },
            { new: true, runValidators: true }
        );

        if (!updatedChat) {
            return res.status(404).json({ error: 'Chat not found' });
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
        const { chatId } = req.params;
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        const messages = chat.messages;
        const myId = req.userId?.toString();
        
        res.status(200).json({ messages, myId });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
        next(error);
    }
}


