import * as z from 'zod';
export const teamFormSchema = (isEdit) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(4, {
        message: 'Name must be at least 4 characters',
      })
      .max(30, {
        message: 'Name must not be longer than 30 characters',
      }),
    yearFounded: z.any().refine(
      (value) => {
        const parsedValue =
          typeof value === 'string' ? parseInt(value, 10) : value;
        return !isNaN(parsedValue) && parsedValue > 0;
      },
      {
        message: 'Year founded must be a positive integer',
      }
    ),
    coach: z.string().nullable(),
    city: z.string().trim().min(1, {
      message: 'City is required',
    }),
    country: z.string().min(1, {
      message: 'Country is required',
    }),
    sponsor: z.string().nullable(),
    logo: isEdit
      ? z.any().nullable()
      : z.instanceof(File, {
          message: 'Logo is required',
        }),
    bio: z.string().trim(),
    stadium: z.string().nullable(),
  });
