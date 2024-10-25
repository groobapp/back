import { Router } from 'express'
import { createChat, userChats, findChat, deleteChat, addMessage } from '../controllers/chat/chat.controller.js';
import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.post('/chat', TokenValidator, createChat)
router.post('/message', TokenValidator, addMessage)
router.get('/chats', TokenValidator, userChats)
router.get('/chat/:secondId', TokenValidator, findChat)
router.delete('/delete-chat/:chatId', TokenValidator, deleteChat)

export default router;