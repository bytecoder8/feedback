import z from 'zod'


export const registerSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(4),
  confirm: z.string(),
  avatar: z.string().url().optional(),
})
.refine(data => data.password === data.confirm, {
  path: ['confirm'],
  message: "Passwords don't match"
})
export type RegisterUser = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string()
})
export type LoginUser = z.infer<typeof loginSchema>

export const updateSchema = z.object({
  email: z.string().email().trim(),
  avatar: z.string().url().optional(),
}).partial()
export type UpdateUser = z.infer<typeof updateSchema>

export const publicUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  avatar: z.string().nullable()
})
export type PublicUser = z.infer<typeof publicUserSchema>
