import * as z from 'zod';

export const countryFormSchema = () =>
  z.object({
    name: z
      .string()
      .min(4, {
        message: 'Country name must be at least 4 characters.',
      })
      .max(30, {
        message: 'Country name must not be longer than 30 characters.',
      }),
  });
