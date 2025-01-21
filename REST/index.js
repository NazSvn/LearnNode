const express = require('express')
const app = express()
const crypto = require('node:crypto')
const cities = require('./cities.json')

const {
  validateCities,
  validatePartialCities
} = require('./schema/cities_Schema.js')

app.disable('x-powered-by')

const PORT = process.env.PORT ?? 3000

// there are normal or simple methods like GET/HEAD/POST
// there are complex method like PUT/PATCH/DELETE
// there is also something called CORS PRE-flight wich when used with complex
// methods requires an special attribute called OPTIONS, which is like
// a pre-requirement

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:5500'
]

// express middleware
app.use(express.json())

app.get('/cities', (req, res) => {
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
  }

  const { conditions } = req.query
  if (conditions) {
    const filteredCities = cities.filter((city) =>
      city.current_weather.conditions
        .toLowerCase()
        .includes(conditions.toLowerCase())
    )
    return res.json(filteredCities)
  }
  res.json(cities)
})

app.get('/cities/:id', (req, res) => {
  const { id } = req.params
  const city = cities.find((city) => city.id === id)
  if (city) return res.json(city)
  res.status(404).json({ message: 'City not found' })
})

app.post('/cities', (req, res) => {
  const result = validateCities(req.body)

  if (result.error) {
    // could also be status 422 Unprocessable Entity or just bad request 400
    return res.status(400).json({ error: result.error.message })
  }

  // this is not RESt, because we are mutating the and saving the state in the memory insted of using a ddbb
  const newCity = {
    id: crypto.randomUUID(), // or I could use crypto (const crypto = require('node:crypto)) to generate a random UUID
    ...result.data
  }

  cities.push(newCity)
  res.status(201).json(newCity) // this could be useful to update the clients cache.
})

app.patch('/cities/:id', (req, res) => {
  const result = validatePartialCities(req.body)
  if (result.error) {
    // could also be status 422 Unprocessable Entity or just bad request 400
    return res.status(400).json({ error: result.error.message })
  }

  const { id } = req.params
  const cityIndex = cities.findIndex((city) => city.id === id)
  if (cityIndex === -1) {
    res.status(404).json({ message: 'City not found' })
  }
  const updateCity = {
    ...cities[cityIndex],
    ...result.data,
    current_weather: {
      ...cities[cityIndex].current_weather,
      ...(result.data.current_weather || {})
    }
  }
  cities[cityIndex] = updateCity
  return res.json(updateCity)
})

app.delete('/cities/:id', (req, res) => {
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  const { id } = req.params
  const cityIndex = cities.findIndex((city) => city.id === id)
  if (cityIndex === -1) {
    return res.status(404).json({ message: 'City not found' })
  }
  cities.splice(cityIndex, 1)
  return res.json({ message: 'City deleted' })
})

app.options('/cities/:id', (req, res) => {
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
  }
  res.sendStatus(200)
})

app.use((req, res) => {
  res.status(404).send('Error 404 not found')
})

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})
