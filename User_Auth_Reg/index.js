import express from 'express'
import { JWT_KEY, PORT } from './config.js'
import { UserRepository } from './user-repository.js'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()

app.set('view engine', 'ejs')
app.use(cors())
app.disable('x-powered-by')
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }

  try {
    const decoded = jwt.verify(token, JWT_KEY)
    req.session.user = decoded
  } catch {
    /* Empty */
  }
  next()
})

app.get('/', async (req, res) => {
  const user = req.session.user
  res.render('index', user)
})

app.get('/user-login', async (req, res) => {
  res.render('login')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_KEY, {
      expiresIn: '1h'
    })

    res
      .cookie('access_token', token, {
        httpOnly: true, // Cannot be accessed by JavaScript
        secure: process.env.NODE_ENV === 'production', // Can only be sent over HTTPS
        sameSite: 'strict', // Can only be sent to the same site
        maxAge: 1000 * 60 * 60 // Expires in 1 hour
      })
      .status(200)
      .json({ message: 'Login successful', user: user.username })
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
app.post('/logout', async (req, res) => {
  res.clearCookie('access_token').json({ message: 'Logged out' })
})

app.get('/protected', async (req, res) => {
  const user = req.session.user
  if (!user) return res.status(401).json({ message: 'Unauthorized' })

  res.render('protected', user)
})

app.listen(PORT, () => {
  console.log(`Server is runnning on http://localhost:${PORT}`)
})
