import type { Request, Response } from "express"
import { prisma } from "@/lib/prisma-client"
import { postFullSchema, postListSchema, postSchema } from "@/schemas/post"


const PostController = {
  async createPost(req: Request, res: Response) {

    const { title, description, category_id } = req.body

    // Find first available status
    const firstStatus = await prisma.status.findFirstOrThrow({
      orderBy: {
        id: 'asc',
      },
    })
    const status_id = firstStatus.id

    const data = {
      title,
      description,
      category_id,
      status_id,
      author_id: res.locals.user?.userId,
    }

    try {
      await prisma.category.findUniqueOrThrow({
        where: {
          id: category_id
        }
      })

      const post = await prisma.post.create({
        data
      })
      return res.json(postSchema.parse(post))
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal server error" })
    }
  },

  async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await prisma.post.findMany({
        include: {
          author: true,
        },
        orderBy: {
          created_at: 'desc'
        }
      })
      return res.json(postListSchema.parse(posts))
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal server error" })
    }
  },

  async getPostById(req: Request, res: Response) {
    const { id } = req.params

    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          author: true,
        },
      })

      if (!post) {
        return res.status(404).json({ error: "Post not found" })
      }
      return res.json(postFullSchema.parse(post))
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal server error" })
    }
  },

  async updatePost(req: Request, res: Response) {
    const { id } = req.params
    const { userId } = res.locals.user
    const data = {
      title: req.body.title,
      description: req.body.description
    }

    try {
      const post = await prisma.post.findUnique({
        where: { id }
      })

      if (!post) {
        return res.status(404).json({ error: "Post not found" })
      }

      if (post.author_id !== userId) {
        return res.status(403).json({ error: "Unauthorized" })
      }

      const updatedPost = await prisma.post.update({
        where: { id },
        data
      })
      return res.json(postSchema.parse(updatedPost))
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal server error" })
    }
  },

  async deletePost(req: Request, res: Response) {
    const { id } = req.params
    const { userId } = res.locals.user

    try {
      const post = await prisma.post.findUnique({
        where: {
          id,
          author_id: userId
        }
      })

      if (!post) {
        return res.status(404).json({ error: "Post not found" })
      }

      await prisma.$transaction([
        prisma.post.delete({ where: { id } })
      ])
      return res.json({ status: 'ok' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal server error" })
    }
  }
}

export {
  PostController
}
