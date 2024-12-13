import * as z from 'zod';

export const trainingValidationSchema = () =>
  z.object({
    name: z.string().min(1, {
      message: 'Name is required',
    }),
    trainingDate: z.coerce.date().refine(
      (val) => {
        const date = new Date(val);
        const today = new Date();
        return date.getTime() >= today.getTime();
      },
      {
        message: 'Training date must be in the future or today',
      }
    ),
    duration: z.coerce
      .number()
      .min(1, {
        message: 'Duration is required',
      })
      .max(999, {
        message: 'Duration must be less than 999',
      }),
    description: z.string().optional(),
    trainingType: z.string().min(1, {
      message: 'Type is required',
    }),

    location: z.string().min(1, {
      message: 'Location is required',
    }),
    notes: z.string().optional(),
    equipment: z.string().optional(),
  });

export const trainingTypeValidationSchema = () =>
  z.object({
    name: z.string().min(1, {
      message: 'Name is required',
    }),
    description: z.string().min(1, {
      message: 'Description is required',
    }),
  });
