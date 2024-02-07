import { Router } from 'express'
import { getWallet, buyContentById, bringAllPurchasesByUser, createWithdrawalRequest } from '../controllers/wallet/wallet.controller.js';
import { TokenValidator } from '../libs/tokenValidator.js';
const router = Router()


router.post('/create-withdrawl-request', TokenValidator, createWithdrawalRequest)
router.post('/buy-content', TokenValidator, buyContentById)

router.get('/purchasesByUser', TokenValidator, bringAllPurchasesByUser)
router.get('/wallet', TokenValidator, getWallet)

export default router;