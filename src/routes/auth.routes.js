import { Router } from 'express'
import { signup, login, logout, consultaComercial, changePassword } from '../controllers/auth/auth.controller.js';
// import schemaValidator from 'express-joi-middleware'
// import { LoginSchema, SignupSchema } from '../schemas/auth.schema.js';
import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.post('/registro', signup)

router.post('/login', login)

router.post('/logout', TokenValidator, logout)

router.post('/consulta-comercial', consultaComercial)

router.put('/change-password', TokenValidator, changePassword)



export default router;