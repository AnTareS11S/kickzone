import * as z from 'zod';

export const signUpFormSchema = () =>
  z
    .object({
      username: z
        .string()
        .trim()
        .min(4, {
          message: 'Username must be at least 4 characters.',
        })
        .max(30, {
          message: 'Username must not be longer than 30 characters.',
        }),
      email: z
        .string()
        .email({
          message: 'Invalid email.',
        })
        .trim(),
      password: z
        .string()
        .trim()
        .min(6, {
          message: 'Password must be at least 6 characters.',
        })
        .max(30, {
          message: 'Password must not be longer than 30 characters.',
        }),
      confirmPassword: z.string().trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match.',
      path: ['confirmPassword'],
    })
    .refine((data) => data.username !== data.password, {
      message: 'Username and password must be different.',
      path: ['password'],
    });

export const signInFormSchema = () =>
  z.object({
    email: z
      .string()
      .email({
        message: 'Invalid email.',
      })
      .trim(),
    password: z.string().trim().min(1, {
      message: 'Password is required.',
    }),
  });

export const onboardingFormSchema = () =>
  z.object({
    username: z.string().trim().min(3, {
      message: 'Username must be at least 3 characters.',
    }),
    bio: z
      .string()
      .trim()
      .min(1, {
        message: 'Bio is required.',
      })
      .max(50, {
        message: 'Bio must not be longer than 50 characters.',
      }),
    wantedRole: z.string().min(1, {
      message: 'Role is required',
    }),
  });
