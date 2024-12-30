import express from "express"
import z from 'zod'
import validate from "@/lib/zod-express-validator"
import { PostController } from "@/controllers/post-controller"
import { authenticateToken } from "@/middleware/auth"
import { createSchema, postsQuerySchema, updateSchema } from "@/schemas/post"
import { UpvoteController } from "@/controllers/upvote-controller"


export const router = express.Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         author_id:
 *           type: string
 *         category_id:
 *           type: string
 *         status_id:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date
 *         updated_at:
 *           type: string
 *           format: date
 *     PostFull:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         author_id:
 *           type: string
 *         category_id:
 *           type: string
 *         status_id:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date
 *         updated_at:
 *           type: string
 *           format: date
 *         author:
 *           $ref: '#/components/schemas/User'
 *         status:
 *           $ref: '#/components/schemas/Status'
 *         category:
 *           $ref: '#/components/schemas/Category'
 *     PostCreate:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - category_id
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category_id:
 *           type: string
 *     PostUpdate:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * /posts:
 *  get:
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *           content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    posts:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/PostFull'
 *                    total:
 *                      type: number
 *                    page:
 *                      type: number
 *                    max_page:
 *                      type: number
 *                    per_page:
 *                      type: number
 *
 */
router.get('/posts', validate({
  query: postsQuerySchema,
}), PostController.getAllPosts)

/**
 * @swagger
 * /posts/{id}:
 *  get:
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *           content:
 *              application/json:
 *                schema:
 *                    $ref: '#/components/schemas/PostFull'
 */
router.get('/posts/:id', PostController.getPostById)

/**
 * @swagger
 * /posts/:
 *  post:
 *     requestBody:
 *         in: body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostCreate'
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *           content:
 *              application/json:
 *                schema:
 *                    $ref: '#/components/schemas/Post'
 */
router.post('/posts', authenticateToken, validate({
  body: createSchema
}), PostController.createPost)

/**
 * @swagger
 * /posts/:
 *  put:
 *     requestBody:
 *         in: body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostUpdate'
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *           content:
 *              application/json:
 *                schema:
 *                    $ref: '#/components/schemas/Post'
 */
router.put('/posts/:id', authenticateToken, validate({
  params: { id: z.string() },
  body: updateSchema
}), PostController.updatePost)

/**
 * @swagger
 * /posts/{id}:
 *  delete:
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *           content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/ResponseStatus'
 */
router.delete('/posts/:id', authenticateToken, PostController.deletePost)

router.post('/posts/:id/upvote', authenticateToken, validate({
  params: { id: z.string() }
}), UpvoteController.create)

router.delete('/posts/:id/upvote', authenticateToken, validate({
  params: { id: z.string() }
}), UpvoteController.remove)
