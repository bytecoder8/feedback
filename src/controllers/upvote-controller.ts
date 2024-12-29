import { prisma } from "@/lib/prisma-client"
import type { Request, Response } from "express"


export const UpvoteController = {
  async create(req: Request, res: Response) {
    const { id: post_id } = req.params
    const user_id = res.locals.user?.userId as string

    const exists = await prisma.upvote.findUnique({
      where: {
        user_id_post_id: { user_id, post_id }
      }
    })

    if (exists) {
      return res.status(400).json({ error: "You've already upvoted this post" })
    }

    const post = await prisma.post.findUnique({
      where: {
        id: post_id
      }
    })
    if (!post) {
      return res.status(404).json({ error: "Post doesn't exist" })
    }

    await prisma.upvote.create({
      data: {
        user_id, post_id
      }
    })

    return res.json({ status: 'ok' })
  },

  async remove(req: Request, res: Response) {
    const { id: post_id } = req.params

    const user_id = res.locals.user?.userId as string
    const existing = await prisma.upvote.findUnique({
      where: {
        user_id_post_id: { user_id, post_id }
      }
    })
    if (!existing) {
      return res.status(404).json({ error: "Upvote not found" })
    }

    await prisma.upvote.delete({
      where: {
        user_id_post_id: { user_id, post_id }
      }
    })
    return res.json({ status: 'ok' })
  }
}
