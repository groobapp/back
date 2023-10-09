import { Router } from 'express'
import { usersProductsMP } from '../controllers/mercadopago/checkout.controller.js'
import { verifyAccountPay } from '../controllers/mercadopago/verification.controller.js'
import { postsWithPriceByUser, postsWithPriceByUserId } from "../controllers/mercadopago/products.controller.js"
import { webHooks } from '../controllers/mercadopago/webHooks.js'
import { redirectUrlMp } from '../controllers/mercadopago/redirectUrlMp.controller.js'
import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.post('/preferenceVerification', TokenValidator, verifyAccountPay)
router.post('/preferenceProduct', TokenValidator, usersProductsMP)
router.post('/notifications', webHooks)

router.get('/productsByUser', TokenValidator, postsWithPriceByUser)
router.get('/productsByUser/:id', TokenValidator, postsWithPriceByUserId)
router.get('/mp-connect', redirectUrlMp)


export default router;
