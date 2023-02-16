import { Router } from 'express'
import { searchUser } from '../controllers/interaction/searchUser.controller.js';
import { discoverPostsWithImages, discoverPostsWithTexts } from '../controllers/interaction/discoverUsers.js';
import { postsRecomended } from "../controllers/interaction/postsRecomended.controller.js"
import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.get('/search', TokenValidator, searchUser)
router.get('/discover-images', TokenValidator, discoverPostsWithImages)
router.get('/discover-texts', TokenValidator, discoverPostsWithTexts)
router.get('/surfing', postsRecomended)

export default router;