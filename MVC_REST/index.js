import express, { json } from 'express'
import { createCitiesRouter } from './routes/cities.js'
import { corsMiddleware } from './middlewares/cors.js' 

export const createApp = ({ cityModel }) => {
  const app = express()
  // express middleware
  app.use(json())
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  app.use('/cities', createCitiesRouter({ cityModel }))

  /* app.use((req, res) => {
  res.status(404).send('Error 404 not found')
}) */

  const PORT = process.env.PORT ?? 3000
  app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
  })
}
