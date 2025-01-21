const express = require('express')
const app = express()

const citiesData = require('./cities.json')

app.disable('x-powered-by')

const PORT = process.env.PORT ?? 3000

// this is to know how does it work, but you can just use app.use(express.json)
/* app.use((req, res, next) => {
  // here you can so something, checke for user cookies, user validations etc.

  if (req.method !== 'POST') return next()
  if (req.headers['content-type'] !== 'application/json') return next()

  let body = ''
  //listening to the data event
  req.on('data', (chunk) => {
    body += chunk.toString()
  })

  req.on('end', () => {
    const data = JSON.parse(body)
    data.timeStamp = Date.now()

    // here we mutate the info and put it in the body
    req.body = data
    next()
  })
}) */

app.use(express.json())

app.get('/cities', (req, res) => {
  res.json(citiesData)
})

app.post('/cities', (req, res) => {
  res.json(req.body)
})

// this should be the last because is the last thing that the server goes to.
app.use((req, res) => {
  res.status(404).send('Error 404 not found')
})

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`)
})
