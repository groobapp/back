import { Router } from 'express'
import { searchUser } from '../controllers/interaction/searchUser.controller.js';
import { discoverUsers } from '../controllers/interaction/discoverUsers.js';
import { postsRecomended } from "../controllers/interaction/postsRecomended.controller.js"
import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.get('/search', TokenValidator, searchUser)
router.get('/discover', TokenValidator, discoverUsers)
router.get('/surfing', postsRecomended)

export default router;