import { Router } from 'express'
import { mPayment } from '../controllers/payments/checkout.controller.js'
import { verifyAccountPay } from '../controllers/payments/verification.controller.js'
import { webHooks } from '../controllers/payments/webHooks.js'

import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.post('/preferenceVerification', TokenValidator, verifyAccountPay)
router.post('/preferenceProduct', TokenValidator, mPayment)

router.post('/notifications', webHooks)

export default router;
