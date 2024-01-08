import * as z from 'zod';

export const stadiumFormSchema = (isEdit) =>
  z.object({
    name: z
      .string()
      .min(1, {
        message: 'Name must be at least 4 characters.',
      })
      .max(30, {
        message: 'Name must not be longer than 30 characters.',
      })
      .refine(
        async (value) => {
          const res = await fetch('/api/admin/stadium/check', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: value, isEdit }),
          });
          const data = await res.json();
          return data.success;
        },
        {
          message: 'Stadium name already exists.',
        }
      ),
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
