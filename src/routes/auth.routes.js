import { Router } from 'express'
import { signup, login, logout, reset, changePassword } from '../controllers/auth.controller.js';
// import schemaValidator from 'express-joi-middleware'
// import { LoginSchema, SignupSchema } from '../schemas/auth.schema.js';
import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', TokenValidator, logout)

router.post('/reset-password', reset)

router.put('/change-password', TokenValidator, changePassword)



export default router;