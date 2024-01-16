import * as z from 'zod';

export const coachFormSchema = () =>
  z.object({
    name: z
      .string()
      .min(1, {
        message: 'Name must be at least 4 characters.',
      })
      .max(30, {
        message: 'Name must not be longer than 30 characters.',
      }),
    surname: z
      .string()
      .min(1, {
        message: 'Surname must be at least 4 characters.',
      })
      .max(30, {
        message: 'Surname must not be longer than 30 characters.',
      }),
    nationality: z.string(),
    photo: z.string().optional(),
    bio: z.string().min(1, {
      message: 'Bio is required',
    }),
  });
