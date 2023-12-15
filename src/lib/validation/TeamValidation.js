import * as z from 'zod';
export const teamFormSchema = z.object({
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
          body: JSON.stringify({ name: value }),
        });
        const data = await res.json();
        return data.success;
      },
      {
        message: 'Team name already exists.',
      }
    ),
  country: z.string(),
  yearFounded: z.string().min(1, {
    message: 'Year founded is required',
  }),
  coach: z.string().min(1, {
    message: 'Coach is required',
  }),
  city: z.string().min(1, {
    message: 'City is required',
  }),
  photo: z.string().optional(),
  bio: z.string().min(1, {
    message: 'Bio is required',
  }),
});
