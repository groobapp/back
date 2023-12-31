import { Router } from 'express'
import { TokenValidator } from '../libs/tokenValidator.js';
import { follow, getFollowings, getFollowers, unfollow } from '../controllers/followUp/followUp.controller.js';

const router = Router()

router.post('/follow', TokenValidator, follow)

router.post('/unfollow', TokenValidator, unfollow)

router.get('/followers', TokenValidator, getFollowers)

router.get('/followings', TokenValidator, getFollowings)


export default router;