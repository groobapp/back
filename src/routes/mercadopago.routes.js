import { Router } from 'express'
import { usersProductsMP } from '../controllers/mercadopago/checkout.controller.js'
import { verifyAccountPay } from '../controllers/mercadopago/verification.controller.js'
import { webHooks } from '../controllers/mercadopago/webHooks.js'
import { marketplace } from '../controllers/mercadopago/marketplace.controller.js'
import { redirectUrlMp } from '../controllers/mercadopago/redirectUrlMp.controller.js'
import { TokenValidator } from '../libs/tokenValidator.js';


const router = Router()

router.post('/preferenceVerification', TokenValidator, verifyAccountPay)
router.post('/preferenceProduct', TokenValidator, usersProductsMP)
router.post('/notifications', webHooks)

router.get('/mp-connect', redirectUrlMp)
router.get('/products/:id', TokenValidator, marketplace)


export default router;
