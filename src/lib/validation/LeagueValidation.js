import * as z from 'zod';

export const leagueFormSchema = (isEdit) =>
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
          const res = await fetch('/api/league/check', {
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
          message: 'League name already exists.',
        }
      ),
    commissioner: z.string().min(1, {
      message: 'Commissioner is required',
    }),
    bio: z.string().min(1, {
      message: 'Bio is required',
    }),
  });
