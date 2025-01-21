import cities from '../../cities.json' with { type: 'json' }
import { randomUUID } from 'node:crypto'
 
export class CityModel {
  static getAll = async ({conditions}) => {
    if (conditions) {
       return cities.filter((city) =>
        city.current_weather.conditions
          .toLowerCase()
          .includes(conditions.toLowerCase())
      )      
    }
    return cities
  }

  static getById = async ({id}) => {
    const city = cities.find((city) => city.id === id)
    return city
  }

  static create = async ({input}) => {
    const newCity = {
        id: randomUUID(),  
        ...input
      }
    
      cities.push(newCity)

      return newCity
  }

  static delete = async ({id}) => {
    const cityIndex = cities.findIndex((city) => city.id === id)
  if (cityIndex === -1) {
    return false
  }
  cities.splice(cityIndex, 1)
  return true
  }

  static update = async ({id, input}) => {
    const cityIndex = cities.findIndex((city) => city.id === id)
  if (cityIndex === -1) {
    return false
  }

  const updateCity = {
    ...cities[cityIndex],
    ...input,
    current_weather: {
      ...cities[cityIndex].current_weather,
      ...(input.current_weather || {})
    }
  }
  return cities[cityIndex] = updateCity
  }
}