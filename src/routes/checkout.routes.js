import { Router } from 'express'
import { createChat, userChats, findChat } from '../controllers/chat/chat.controller';
import {mPayment} from '../controllers/bussines/checkout.controller'

import { TokenValidator } from '../libs/tokenValidator';

const router = Router()

router.post('/checkout',  mPayment)

module.exports = router;
