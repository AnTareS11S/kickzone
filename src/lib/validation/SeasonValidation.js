import * as z from 'zod';

export const seasonFormSchema = () =>
  z
    .object({
      name: z.string().min(1, { message: 'Name is required' }),
      startDate: z.coerce.date({
        message: 'Start date is required',
      }),
      endDate: z.coerce.date({
        message: 'End date is required',
      }),
    })
    .refine((data) => data?.endDate?.getTime() > data?.startDate?.getTime(), {
      message: 'End date must be after start date',
      path: ['endDate'],
    });
