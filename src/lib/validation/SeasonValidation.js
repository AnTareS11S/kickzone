import * as z from 'zod';

export const seasonFormSchema = () =>
  z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    startDate: z.coerce.date().refine(
      (val) => {
        return val.toLocaleDateString() >= new Date().toLocaleDateString();
      },
      {
        message: 'Training date must be in the future or today',
      }
    ),
    endDate: z.coerce.date().refine(
      (val) => {
        return val.toLocaleDateString() >= new Date().toLocaleDateString();
      },
      {
        message: 'Training date must be in the future or today',
      }
    ),
  });
