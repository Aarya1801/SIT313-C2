import { z } from 'zod'

const emailSchema = z
  .string()
  .trim()
  .email('Enter a valid email address')

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must include an uppercase letter')
  .regex(/[a-z]/, 'Password must include a lowercase letter')
  .regex(/[0-9]/, 'Password must include a number')

export const registrationSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, 'Enter your full name')
      .refine(
        (name) => name.split(/\s+/).filter(Boolean).length >= 2,
        'Enter both your first and last name',
      ),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password'),
})
