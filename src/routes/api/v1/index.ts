import express from "express"
import { router as posts } from "./posts"
import { router as users } from "./users"
import { router as statuses } from "./statuses"
import { router as categories } from "./categories"


export const router = express.Router()

router.use(users)
router.use(posts)
router.use(statuses)
router.use(categories)
