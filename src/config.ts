import z from 'zod'

const input = {
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  jwtAccessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
}
const configSchema = z.object({
  jwtSecretKey: z.string().trim(),
  jwtAccessTokenExpiresIn: z.string().trim()
})
configSchema.parse(input)

export type Config = z.infer<typeof configSchema>
const config = input as Config
export default config
