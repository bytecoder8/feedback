import { StatusController } from "@/controllers/status-controller"
import express from "express"


export const router = express.Router()

router.get('/statuses', StatusController.getAll)
