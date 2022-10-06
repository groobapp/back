import { Router } from 'express'
import { addMessage, getMessages } from '../controllers/chat/messages.controller';
import { TokenValidator } from '../libs/tokenValidator';

const router = Router()

router.post('/message', TokenValidator, addMessage)
router.get('/message/:chatId', TokenValidator, getMessages)

export default router;