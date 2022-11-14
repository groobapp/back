import { Router } from 'express'
import { searchUser } from '../controllers/interaction/searchUser.controller.js';
import { discoverUsers } from '../controllers/interaction/discoverUsers.js';
import { surfing } from "../controllers/interaction/surfing.controller.js"
import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.get('/search', TokenValidator, searchUser)
router.get('/discover', TokenValidator, discoverUsers)
router.get('/surfing', surfing)

export default router;