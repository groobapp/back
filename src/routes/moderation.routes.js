import { Router } from 'express'
import { denouncePost } from '../controllers/moderation/moderation.controller.js'
import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.post('/post/denounce/:id', TokenValidator, denouncePost)

export default router;
