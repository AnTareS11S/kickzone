import * as z from 'zod';

export const sponsorFormSchema = (isEdit) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, {
        message: 'Name must be at least 4 characters',
      })
      .max(30, {
        message: 'Name must not be longer than 30 characters',
      }),
    logo: isEdit
      ? z.any().nullable()
      : z.instanceof(File, {
          message: 'Logo is required',
        }),
    website: z.string().trim().min(1, {
      message: 'Website is required',
    }),
    description: z.string().optional(),
    notes: z.string().optional(),
  });
