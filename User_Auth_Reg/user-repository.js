import mysql from 'mysql2/promise'
import { validateUser } from './schema/authSchema.js'
import bcrypt from 'bcrypt'
import { SALT } from './config.js'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'usersdb'
}

const connection = await mysql.createConnection(config)

export class UserRepository {
  static async create({ username, password }) {
    const validation = validateUser({ username, password })

    if (!validation.success) {
      const errorMessages = validation.error.errors
        .map((e) => e.message)
        .join(', ')
      throw new Error(`Validation failed: ${errorMessages}`)
    }

    const [existingUser] = await connection.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    )

    if (existingUser.length > 0) {
      throw new Error('Username already exists')
    }

    const hashedPassword = await bcrypt.hash(password, SALT)

    const [uuidResult] = await connection.query('SELECT UUID() AS uuid')
    const { uuid } = uuidResult[0]

    try {
      await connection.query(
        'INSERT INTO users (id, username, password) VALUES (UUID_TO_BIN(?), ?, ?)',
        [uuid, username, hashedPassword]
      )
    } catch (error) {
      if (error.message.includes('Duplicate entry')) {
        console.error('Username already exists')
        throw new Error('Username already exists')
      } else {
        console.error('Error inserting user:', error)
        throw new Error('Error inserting user')
      }
    }
    const [createdUser] = await connection.query(
      `
      SELECT BIN_TO_UUID(id) AS id FROM users WHERE username = ?`,
      [username]
    )

    return createdUser[0].id
  }

  static async login({ username, password }) {
    const validation = validateUser({ username, password })

    if (!validation.success) {
      const errorMessages = validation.error.errors
        .map((e) => e.message)
        .join(', ')
      throw new Error(`Validation failed: ${errorMessages}`)
    }

    const [existingUser] = await connection.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    )

    // eslint-disable-next-line capitalized-comments
    /* const [existingUserId] = await connection.query(
      'SELECT BIN_TO_UUID(id) as id FROM users WHERE username = ?',
      [username]
    ) */

    if (existingUser.length === 0) {
      throw new Error('Username does not exist')
    }

    const user = existingUser[0]

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }

    return {
      username: user.username
    }
  }
}
