import z from 'zod'

// Define the weather schema separately so we can reuse it
const weatherSchema = z.object({
  temperature: z.number({
    invalid_type_error: 'Temperature must be a number',
    required_error: 'Temperature is required'
  }),
  unit: z.string({
    invalid_type_error: 'Unit of temperature must be a string',
    required_error: 'Unit type is required, (e.g., celsius, fahrenheit)'
  }),
  humidity: z
    .number({
      invalid_type_error: 'Humidity must be a number',
      required_error: 'Humidity is required'
    })
    .positive(),
  wind_speed: z
    .number({
      invalid_type_error: 'Wind speed must be a number',
      required_error: 'Wind speed is required'
    })
    .positive(),
  conditions: z.string({
    invalid_type_error: 'Weather conditions must be a string',
    required_error: 'Weather condition is required'
  })
})

const citySchema = z.object({
  name: z.string({
    invalid_type_error: 'City name must be a string',
    required_error: 'City name is required'
  }),
  current_weather: weatherSchema
})

// For partial updates, we create a new schema where all fields are optional
const partialCitySchema = z.object({
  name: z
    .string({
      invalid_type_error: 'City name must be a string'
    })
    .optional(),
  current_weather: weatherSchema.partial().optional()
})

export function validateCities(object) {
  return citySchema.safeParse(object)
}

export function validatePartialCities(object) {
  return partialCitySchema.partial().safeParse(object)
}
