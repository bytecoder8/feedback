import z from 'zod'



export const upvoteSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  post_id: z.string(),
  created_at: z.date(),
})
