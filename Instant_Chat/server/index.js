import express from 'express'
import logger from 'morgan'
import { randomUUID } from 'node:crypto'

import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

dotenv.config()

const PORT = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {}
})

const db = createClient({
  url: 'libsql://deciding-skyrocket-nazsvn.turso.io',
  authToken: process.env.TURSO_DB_TOKEN
})

const getOneHourAgo = () => {
  const date = new Date()
  date.setHours(date.getHours() - 1)
  return date.toISOString()
}

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
  `)

io.on('connection', async (socket) => {
  console.log('An user has connected')

  socket.on('disconnect', () => {
    console.log('An user has disconnected')
  })

  socket.on('chat message', async (msg) => {
    let result
    const id = randomUUID()
    const timestamp = new Date().toISOString()
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (id, content, created_at) VALUES (?, ?, ?)',
        args: [id, msg, timestamp]
      })
    } catch (error) {
      throw new Error('Server Error')
    }

    io.emit('chat message', msg, timestamp)
  })

  if (!socket.recovered) {
    try {
      const result = await db.execute({
        sql: 'SELECT id, content, created_at FROM messages WHERE created_at > ? ORDER BY created_at ASC',
        args: [socket.handshake.auth.serverOffset ?? getOneHourAgo()]
      })

      if (result.rows && result.rows.length > 0) {
        result.rows.forEach((row) => {
          socket.emit('chat message', row.content, row.created_at)
        })
      }
    } catch (error) {
      console.error(error)
      throw new Error('Error recovering messages')
    }
  }
})

app.use(logger('dev'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})
