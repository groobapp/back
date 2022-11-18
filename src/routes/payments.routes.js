import { Router } from 'express'
import { bringAllPurchasesByUser } from '../controllers/payments.controller.js'
import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.get('/purchasesByUser', TokenValidator, bringAllPurchasesByUser)

export default router;
