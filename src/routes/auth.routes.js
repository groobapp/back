import { Router } from 'express'
import { signup, login, logout } from '../controllers/auth.controller.js';
import { schemaValidator } from '../libs/schemasValidator.js';
import { LoginSchema, SignupSchema } from '../schemas/auth.schema.js';
import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.post('/signup', schemaValidator(SignupSchema), signup)

router.post('/login', login)

router.post('/logout', TokenValidator, logout)

// router.post('/reset', TokenValidator, reset)

export default router;