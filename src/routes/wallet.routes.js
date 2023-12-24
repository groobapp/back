import { Router } from 'express'
import { bringAllPurchasesByUser, buyContentById, getWallet } from '../controllers/wallets/fiatWallet.controller.js';
import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.get('/purchasesByUser', TokenValidator, bringAllPurchasesByUser)
router.get('/wallet', TokenValidator, getWallet)

router.post('/buy-content', TokenValidator, buyContentById)

export default router;