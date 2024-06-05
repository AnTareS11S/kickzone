import * as z from 'zod';

export const leagueFormSchema = () =>
  z.object({
    name: z
      .string()
      .min(4, {
        message: 'Name must be at least 4 characters.',
      })
      .max(30, {
        message: 'Name must not be longer than 30 characters.',
      })
      .trim(),
    commissioner: z
      .string()
      .min(1, {
        message: 'Commissioner is required',
      })
      .trim(),
    country: z.string().min(1, {
      message: 'Country is required',
    }),
    bio: z
      .string()
      .min(1, {
        message: 'Bio is required',
      })
      .trim(),
    season: z.string().min(1, {
      message: 'Season is required',
    }),
  });
