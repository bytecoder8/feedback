import express from "express"
import { router as posts } from "./posts"
import { router as users } from "./users"
import { router as statuses } from "./statuses"
import { router as categories } from "./categories"


export const router = express.Router()

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     ResponseStatus:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 */

router.use(users)
router.use(posts)
router.use(statuses)
router.use(categories)
