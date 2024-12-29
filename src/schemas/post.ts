import z from 'zod'
import { publicUserSchema } from './user'


export const createSchema = z.object({
  title: z.string().trim().min(3),
  description: z.string().trim().min(3),
  category_id: z.string(),
})
export const updateSchema = z.object({
  title: z.string().trim().min(3),
  description: z.string().trim().min(3),
})

export const postsQuerySchema = z.object({
  sort_field: z.enum(['created_at', 'upvotes']).default('created_at'),
  sort_dir: z.enum(['asc', 'desc']).default('desc'),
  categories: z.array(z.string()).default([]),
  statuses: z.array(z.string()).default([])
})

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  author_id: z.string(),
  category_id: z.string(),
  status_id: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
})

export const postFullSchema = postSchema.merge(z.object({
  author: publicUserSchema,
  category: z.any(),
  status: z.any(),
  upvotes: z.any(),
}))

export const postListSchema = z.array(postFullSchema)

export type Post = z.infer<typeof postSchema>
export type PostFull = z.infer<typeof postFullSchema>
export type PostList = z.infer<typeof postListSchema>
export type PostCreateBody = z.infer<typeof createSchema>
export type PostUpdateBody = z.infer<typeof updateSchema>
export type PostQuery = z.infer<typeof postsQuerySchema>
