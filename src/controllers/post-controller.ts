import type { Request, Response } from "express"
import { prisma } from "@/lib/prisma-client"
import { PostCreateBody, PostQuery, PostUpdateBody, postFullSchema, postListSchema, postSchema } from "@/schemas/post"
import { clamp } from "@/utils"


const PostController = {
  async createPost(req: Request, res: Response) {

    const { title, description, category_id } = req.body as PostCreateBody

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
      const { sort_field, sort_dir, categories, statuses, page } = req.query as PostQuery
      // Sorting
      let orderBy = {}
      if (sort_field === 'upvotes') {
        orderBy = {
          "upvotes": {
            _count: sort_dir
          }
        }
      } else {
        orderBy = { [sort_field] : sort_dir }
      }

      // Filtering
      let where: {[key: string]: {}} = {}
      if (categories.length > 0) {
        where.category_id = {
          in: categories
        }
      }
      if (statuses.length > 0) {
        where.status_id = {
          in: statuses
        }
      }

      // Pagination
      const postsCount = await prisma.post.count({
        orderBy,
        where
      })

      const perPage = 5
      const maxPage = Math.ceil(postsCount / perPage)
      let currentPage = clamp(parseInt(page) || 1, 1, maxPage)

      const posts = await prisma.post.findMany({
        include: {
          author: true,
          status: true,
          category: true,
          upvotes: true,
        },
        orderBy,
        where,
        skip: (currentPage - 1) * perPage,
        take: perPage
      })

      return res.json({
        posts: postListSchema.parse(posts),
        total: postsCount,
        page: currentPage,
        max_page: maxPage,
        per_page: perPage,
      })
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

    const { title, description } = req.body as PostUpdateBody

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
        data: {
          title, description
        }
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
