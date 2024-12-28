import express from "express"
import z from 'zod'
import validate from "@/lib/zod-express-validator"
import { PostController } from "@/controllers/post-controller"
import { authenticateToken } from "@/middleware/auth"
import { createSchema, updateSchema } from "@/schemas/post"


export const router = express.Router()

router.get('/', PostController.getAllPosts)
router.get('/:id', PostController.getPostById)

router.post('/', authenticateToken, validate({
  body: createSchema
}), PostController.createPost)

router.put('/:id', authenticateToken, validate({
  params: { id: z.string() },
  body: updateSchema
}), PostController.updatePost)

router.delete('/:id', authenticateToken, PostController.deletePost)
