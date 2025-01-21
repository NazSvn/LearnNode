import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'citiesdb'
}

const connection = await mysql.createConnection(config)

const joinCityWithWeather = (cities) => {
  return cities.map((city) => ({
    id: city.id,
    name: city.name,
    current_weather: {
      temperature: city.temperature,
      unit: city.unit,
      humidity: city.humidity,
      wind_speed: city.wind_speed,
      conditions: city.conditions
    },
    last_updated: city.last_updated
  }))
}

export class CityModel {
  static getAll = async ({ conditions }) => {
    let cities
    if (conditions) {
      const lowerCaseConditions = conditions.toLowerCase()

      const [filteredCities] = await connection.query(
        `
      SELECT 
          BIN_TO_UUID(c.id) as id,
          c.name,
          w.temperature,
          w.unit,
          w.humidity,
          w.wind_speed,
          w.conditions,
          c.last_updated
      FROM city c
      LEFT JOIN current_weather w ON w.city_id = c.id
      WHERE LOWER(w.conditions) = ?
      `,
        [lowerCaseConditions]
      )

      cities = filteredCities
    } else {
      const [allCities] = await connection.query(`
        SELECT 
            BIN_TO_UUID(c.id) as id,
            c.name,
            w.temperature,
            w.unit,
            w.humidity,
            w.wind_speed,
            w.conditions,
            c.last_updated
        FROM city c
        LEFT JOIN current_weather w ON w.city_id = c.id
    `)

      cities = allCities
    }
    return joinCityWithWeather(cities)
  }

  static getById = async ({ id }) => {
    const [cities] = await connection.query(
      `
      SELECT 
          BIN_TO_UUID(c.id) as id,
          c.name,
          w.temperature,
          w.unit,
          w.humidity,
          w.wind_speed,
          w.conditions,
          c.last_updated
      FROM city c
      LEFT JOIN current_weather w ON w.city_id = c.id
      WHERE c.id = UUID_TO_BIN(?)
      `,
      [id]
    )

    return joinCityWithWeather(cities)
  }

  static create = async ({ input }) => {
    const { name } = input

    const { temperature, unit, humidity, wind_speed, conditions } =
      input.current_weather

    const formattedDate = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ')

    const [uuidResult] = await connection.query('SELECT UUID() AS uuid')
    const { uuid } = uuidResult[0]

    try {
      await connection.query(
        `
      INSERT INTO city (id, name, last_updated)
      VALUES (UUID_TO_BIN(?), ?, ?)
      `,
        [uuid, name, formattedDate]
      )

      await connection.query(
        `
      INSERT INTO current_weather (
        city_id,
        temperature,
        unit,
        humidity,
        wind_speed,
        conditions 
    )
    VALUES (
        UUID_TO_BIN(?),
        ?,
        ?,
        ?,
        ?,
        ? 
    )
    `,
        [uuid, temperature, unit, humidity, wind_speed, conditions]
      )
    } catch (error) {
      throw new Error('Error creating new entry')
    }

    const [cities] = await connection.query(
      `
    SELECT 
        BIN_TO_UUID(c.id) as id,
        c.name,
        w.temperature,
        w.unit,
        w.humidity,
        w.wind_speed,
        w.conditions,
        c.last_updated
    FROM city c
    LEFT JOIN current_weather w ON w.city_id = c.id
    WHERE c.id = UUID_TO_BIN(?)
    `,
      [uuid]
    )

    return joinCityWithWeather(cities)
  }

  static delete = async ({ id }) => {
    try {
      await connection.beginTransaction()
      await connection.query(
        `DELETE FROM current_weather WHERE city_id = UUID_TO_BIN(?)`,
        [id]
      )

      const [result] = await connection.query(
        `DELETE FROM city WHERE id = UUID_TO_BIN(?)`,
        [id]
      )

      await connection.commit()

      if (result.affectedRows === 0) {
        throw new Error('City not found')
      }

      return true
    } catch (error) {
      await connection.rollback()
      throw new Error('Error deleting city')
    }
  }

  static update = async ({ id, input }) => {
    try {
      await connection.beginTransaction()

      if (input.name) {
        await connection.query(
          `
          UPDATE city
          SET name = ?,
          last_updated= ?
          WHERE id = UUID_TO_BIN(?)`,
          [
            input.name,
            new Date().toISOString().slice(0, 19).replace('T', ' '),
            id
          ]
        )
      }

      if (input.current_weather) {
        const updates = []
        const values = []
        const weatherFields = {
          temperature: 'temperature',
          unit: 'unit',
          humidity: 'humidity',
          wind_speed: 'wind_speed',
          conditions: 'conditions'
        }

        // Build dynamic update query based on provided fields
        Object.entries(input.current_weather).forEach(([key, value]) => {
          if (key in weatherFields) {
            updates.push(`${weatherFields[key]} = ?`)
            values.push(value)
          }
        })

        if (updates.length > 0) {
          const updateQuery = `
          UPDATE current_weather 
          SET ${updates.join(', ')}
          WHERE city_id = UUID_TO_BIN(?)
        `
          values.push(id)
          await connection.query(updateQuery, values)
        }
      }

      await connection.commit()

      // Fetch and return updated data
      const [cities] = await connection.query(
        `
      SELECT 
          BIN_TO_UUID(c.id) as id,
          c.name,
          w.temperature,
          w.unit,
          w.humidity,
          w.wind_speed,
          w.conditions,
          c.last_updated
      FROM city c
      LEFT JOIN current_weather w ON w.city_id = c.id
      WHERE c.id = UUID_TO_BIN(?)
      `,
        [id]
      )

      if (cities.length === 0) {
        throw new Error('City not found')
      }

      return joinCityWithWeather(cities)[0]
    } catch (error) {
      await connection.rollback()
      throw new Error('Error updating city')
    }
  }
}
