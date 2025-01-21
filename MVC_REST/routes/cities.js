import { Router } from 'express'
import { CityController } from '../controllers/cities.js'

export const createCitiesRouter = ({ cityModel }) => {
  const citiesRouter = Router()

  const cityController = new CityController({ cityModel })

  citiesRouter.get('/', cityController.getAll)
  citiesRouter.post('/', cityController.create)

  citiesRouter.get('/:id', cityController.getById)
  citiesRouter.delete('/:id', cityController.delete)
  citiesRouter.patch('/:id', cityController.update)

  return citiesRouter
}
