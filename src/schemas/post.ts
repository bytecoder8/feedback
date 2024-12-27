import z from 'zod'
import { publicUserSchema } from './user'


export const createSchema = z.object({
  title: z.string().trim().min(3),
  description: z.string().trim().min(3),
  author_id: z.string(),
  status_id: z.string(),
  category_id: z.string(),
})
export const updateSchema = z.object({
  title: z.string().trim().min(3),
  description: z.string().trim().min(3),
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
  author: publicUserSchema
}))

export const postListSchema = z.array(postFullSchema)

export type Post = z.infer<typeof postSchema>
export type PostFull = z.infer<typeof postFullSchema>
export type PostList = z.infer<typeof postListSchema>
