import * as z from 'zod';

export const countryFormSchema = (isEdit) =>
  z.object({
    name: z
      .string()
      .min(1, {
        message: 'Country name must be at least 4 characters.',
      })
      .max(30, {
        message: 'Country name must not be longer than 30 characters.',
      })
      .refine(
        async (value) => {
          const res = await fetch('/api/admin/country/check', {
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
          message: 'Country name already exists.',
        }
      ),
  });
