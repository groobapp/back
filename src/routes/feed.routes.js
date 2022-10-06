import { Router } from 'express'
import { createPost, getPostById, deletePost, commentPost, likePost, dislikePost } from '../controllers/publications.controller';
import {getAllPostsByFollowings} from '../controllers/interaction/getAllPostsByFollowings.controller'
import { TokenValidator } from '../libs/tokenValidator';
import { schemaValidation } from '../libs/schemasValidator';
import multer from "../libs/multer"
import { CreatePublicationSchema, GetOrDeletePublicationByIdSchema } from '../schemas/publications.schema';
import { getAllPostsByUser } from '../controllers/profile.controller';
const router = Router()

router.post('/post', TokenValidator, multer.fields([{
    name: 'images', 
    maxCount: 7
}]), schemaValidation(CreatePublicationSchema), createPost)
router.post('/like/:id', TokenValidator, likePost)
router.post('/dislike/:id', TokenValidator, dislikePost)
router.post('/post/:id', TokenValidator,  commentPost)
router.get('/posts', TokenValidator, getAllPostsByFollowings) 
router.get('/posts/:id', TokenValidator, getAllPostsByUser) 
router.get('/post/:id', schemaValidation(GetOrDeletePublicationByIdSchema), getPostById)
router.delete('/post/:id', TokenValidator, schemaValidation(GetOrDeletePublicationByIdSchema), deletePost)

export default router;