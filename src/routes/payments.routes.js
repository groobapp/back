import { Router } from 'express'
import { mPayment } from '../controllers/payments/checkout.controller.js'
import { verifyAccountPay } from '../controllers/payments/verification.controller.js'
// import { webHook } from '../controllers/payments/webHooks.controller.js'

import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.post('/preferenceVerification', TokenValidator, verifyAccountPay)
router.post('/preferenceProduct', TokenValidator, mPayment)

// router.post('/notifications', webHook)

export default router;
