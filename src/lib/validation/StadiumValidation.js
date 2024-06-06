import * as z from 'zod';

export const stadiumFormSchema = () =>
  z.object({
    name: z
      .string()
      .min(1, {
        message: 'Stadium name must be at least 4 characters.',
      })
      .max(30, {
        message: 'Stadium name must not be longer than 30 characters.',
      }),
    capacity: z.any().refine(
      (value) => {
        const parsedValue =
          typeof value === 'string' ? parseInt(value, 10) : value;

        return !isNaN(parsedValue) && parsedValue > 0;
      },
      {
        message: 'Capacity must be a positive integer',
      }
    ),
    country: z.string().min(1, {
      message: 'Country is required',
    }),
    city: z.string().min(1, {
      message: 'City is required',
    }),
    location: z.string().min(1, {
      message: 'Location is required, coordinates are preferred',
    }),
    history: z.string().min(1, {
      message: 'History is required',
    }),
  });
