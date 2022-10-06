import { Router } from 'express'
import { signup, login, logout } from '../controllers/auth.controller.js';
// import { schemaValidation } from '../libs/schemasValidator';
// import { LoginSchema, SignupSchema } from '../schemas/auth..schema';
import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', TokenValidator, logout)

// router.post('/reset', TokenValidator, reset)

export default router;