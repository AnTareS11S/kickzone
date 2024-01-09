import * as z from 'zod';
export const teamFormSchema = (isEdit) =>
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
          const res = await fetch('/api/team/check', {
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
          message: 'Team name already exists.',
        }
      ),

    yearFounded: z.any().refine(
      (value) => {
        // If the value is a string, try to parse it as an integer
        const parsedValue =
          typeof value === 'string' ? parseInt(value, 10) : value;
        // Validate that the parsed value is a positive integer
        return !isNaN(parsedValue) && parsedValue > 0;
      },
      {
        message: 'Year founded must be a positive integer',
      }
    ),
    coach: z.string().min(1, {
      message: 'Coach is required',
    }),
    city: z.string().min(1, {
      message: 'City is required',
    }),
    country: z.string().min(1, {
      message: 'Country is required',
    }),
    logo: z.string().optional(),
    bio: z.string().min(1, {
      message: 'Bio is required',
    }),
    stadium: z.string().min(1, {
      message: 'Stadium is required',
    }),
  });
