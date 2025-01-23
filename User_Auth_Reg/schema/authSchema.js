import z from 'zod'

const UserSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username must be at most 20 characters long' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores'
    }),
  password: z
    .string()
    .min(8, { message: 'password must be at least 8 characters long' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter'
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter'
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[!@#$%^&*()]/, {
      message: 'Password must contain at least one special character'
    })
})

export function validateUser(userData) {
  const result = UserSchema.safeParse(userData)

  if (!result.success) {
    return {
      success: false,
      error: result.error
    }
  }

  return {
    success: true,
    data: result.data
  }
}
