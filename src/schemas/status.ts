import z from 'zod'



export const statusSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.date(),
})
