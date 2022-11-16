import { Router } from 'express'
import { mPayment } from '../controllers/mercadopago/checkout.controller.js'
import { verifyAccountPay } from '../controllers/mercadopago/verification.controller.js'
import { webHooks } from '../controllers/mercadopago/webHooks.js'
import { marketplace } from '../controllers/mercadopago/marketplace.controller.js'
import { redirectUrlMp } from '../controllers/mercadopago/redirectUrlMp.controller.js'
import { TokenValidator } from '../libs/tokenValidator.js';


const router = Router()

router.post('/preferenceVerification', TokenValidator, verifyAccountPay)
router.post('/preferenceProduct', TokenValidator, mPayment)
router.get('/marketplace', marketplace)
router.post('/mp-connect', redirectUrlMp)

router.post('/notifications', webHooks)

export default router;
