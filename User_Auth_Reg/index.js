import express from 'express'
import { PORT } from './config.js'
import { UserRepository } from './user-repository.js'
import cors from 'cors'

const app = express()

app.set('view engine', 'ejs')
app.use(cors())
app.disable('x-powered-by')
app.use(express.json())

app.get('/', async (req, res) => {
  res.render('index')
})

app.get('/user-login', async (req, res) => {
  res.render('login')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })
    res.status(200).json({ message: 'Login successful', user: user.username })
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: error.message })
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const id = await UserRepository.create({
      username,
      password
    })
    res.status(201).json({ message: 'User created successfully', userId: id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
})
app.post('/logout', async (req, res) => {})

app.get('/protected', async (req, res) => {})

app.listen(PORT, () => {
  console.log(`Server is runnning on http://localhost:${PORT}`)
})
