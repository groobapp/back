import { Router } from 'express'
import { createFiatWallet, getFiatWallet, updateFiatWallet } from '../controllers/bussines/fiatWallet.controller';
import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.post('/wallet-fiat', TokenValidator, createFiatWallet)
router.get('/wallet-fiat', TokenValidator, getFiatWallet)
router.put('/wallet-fiat/:id', TokenValidator, updateFiatWallet)

export default router;