import swaggerJSDoc, { Options } from 'swagger-jsdoc'
import express from 'express'
import swaggerUI from 'swagger-ui-express'


export const options: Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Feedback API',
      version: '1.0.0',
    },
    servers: [{ url: '/api/v1' }]
  },
  apis: ['./src/routes/api/v1/**/*.ts'],
}

export const swagger = express.Router()
const openapiSpecification = swaggerJSDoc(options)
swagger.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(options)))
swagger.get('/swagger.json', (req, res) => {
  res.status(200).json(openapiSpecification);
})
