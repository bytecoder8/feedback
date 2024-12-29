import express from "express"
import z from 'zod'
import validate from "@/lib/zod-express-validator"
import { PostController } from "@/controllers/post-controller"
import { authenticateToken } from "@/middleware/auth"
import { createSchema, updateSchema } from "@/schemas/post"


export const router = express.Router()

router.get('/posts', PostController.getAllPosts)
router.get('/posts/:id', PostController.getPostById)

router.post('/posts', authenticateToken, validate({
  body: createSchema
}), PostController.createPost)

router.put('/posts/:id', authenticateToken, validate({
  params: { id: z.string() },
  body: updateSchema
}), PostController.updatePost)

router.delete('/posts/:id', authenticateToken, PostController.deletePost)