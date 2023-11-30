import { Router } from 'express'
import { createPost, getPostById, deletePost, commentPost, likePost, dislikePost, getAllPostsByUserById } from '../controllers/posts/posts.controller.js';
import { getAllPostsByFollowings } from '../controllers/interaction/getAllPostsByFollowings.controller.js'
import { TokenValidator } from '../libs/tokenValidator.js';
import multer from "../libs/multer.js"
import { getAllPostsByUser } from '../controllers/profile/profile.controller.js';
const router = Router()

router.post('/post', TokenValidator, multer.fields([{
    name: 'images',
    maxCount: 7
}]), createPost)
router.post('/like/:id', TokenValidator, likePost)
router.post('/dislike/:id', TokenValidator, dislikePost)
router.post('/post/:id', TokenValidator, commentPost)

router.get('/posts', TokenValidator, getAllPostsByFollowings)
router.get('/posts-user', TokenValidator, getAllPostsByUser)
router.get('/posts-user/:id', TokenValidator, getAllPostsByUserById)
router.get('/post/:id', TokenValidator, getPostById)

router.delete('/post/:id', TokenValidator, deletePost)

export default router;