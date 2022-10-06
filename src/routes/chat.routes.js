import { Router } from 'express'
import { createChat, userChats, findChat } from '../controllers/chat/chat.controller';
import { TokenValidator } from '../libs/tokenValidator';

const router = Router()

router.post('/chat', TokenValidator, createChat)
router.get('/chats', TokenValidator, userChats)
router.get('/chat/:secondId', TokenValidator, findChat)

export default router;