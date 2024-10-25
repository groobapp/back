import Chat from "../../models/Chat.js"




export const getMessages = async (req, res, next) => {    
    try {
        const { chatId } = req.params;
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: 'Chat no encontrado' });
        }

        const messages = chat.messages;
        chat.messages.forEach(message => {
            message.read = true;
        });
        await chat.save()
        const myId = req.userId?.toString();
        
        res.status(200).json({ messages, myId });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
        next(error);
    }
}


export const getTotalMessagesUnread = async (req, res, next) => {    
    try {
        const { chatId } = req.params;
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: 'Chat no encontrado' });
        }
        let iterations = 0;
        const messages = chat.messages;
        chat.messages.forEach((message)=> {
            if(message.read === false) {
                iterations = iterations + 1
            }
            message.read = true;
        });
        chat.messagesUnread = chat.messagesUnread - iterations
        await chat.save()
        const myId = req.userId?.toString();
        
        res.status(200).json({ messages, myId });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
        next(error);
    }
}


