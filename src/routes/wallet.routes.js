import { Router } from 'express'
import { getWallet, buyContentById, bringAllPurchasesByUser } from '../controllers/wallet/wallet.controller.js';
import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.get('/purchasesByUser', TokenValidator, bringAllPurchasesByUser)
router.get('/wallet', TokenValidator, getWallet)

router.post('/buy-content', TokenValidator, buyContentById)

export default router;