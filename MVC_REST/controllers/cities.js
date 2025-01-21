import {
  validateCities,
  validatePartialCities
} from '../schema/cities_Schema.js'

export class CityController {
  constructor({ cityModel }) {
    this.cityModel = cityModel
  }
  getAll = async (req, res) => {
    const { conditions } = req.query
    const cities = await this.cityModel.getAll({ conditions })
    res.json(cities)
  }
  getById = async (req, res) => {
    const { id } = req.params
    const city = await this.cityModel.getById({ id })
    if (city) return res.json(city)
    res.status(404).json({ message: 'City not found' })
  }
  create = async (req, res) => {
    const result = validateCities(req.body)

    if (result.error) {
      return res.status(400).json({ error: result.error.message })
    }

    // this should be done in ddbb
    const newCity = await this.cityModel.create({ input: result.data })

    res.status(201).json(newCity)
  }
  update = async (req, res) => {
    const result = validatePartialCities(req.body)
    if (result.error) {
      return res.status(400).json({ error: result.error.message })
    }

    const { id } = req.params

    const updateCity = await this.cityModel.update({ id, input: result.data })
    return res.json(updateCity)
  }
  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.cityModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'City not found' })
    }

    return res.json({ message: 'City deleted' })
  }
}

