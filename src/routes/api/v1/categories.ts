import { CategoryController } from "@/controllers/category-controller"
import express from "express"


export const router = express.Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *           content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Category'
 */
router.get('/categories', CategoryController.getAll)
