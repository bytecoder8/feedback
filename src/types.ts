import { Request } from "express"
import z from 'zod'


export const userPayloadSchema = z.object({
  userId: z.string()
})


export type UserPayload = z.infer<typeof userPayloadSchema>

export interface UserRequest extends Request {
  user: UserPayload
}
