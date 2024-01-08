import * as z from 'zod';

export const playerFormSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  surname: z.string().min(1, {
    message: 'Surname is required',
  }),
  nationality: z.string().min(1, {
    message: 'Nationality is required',
  }),
  height: z.string().min(1, {
    message: 'Height is required',
  }),
  weight: z.string().min(1, {
    message: 'Weight is required',
  }),
  position: z.string().min(1, {
    message: 'Position is required',
  }),
  number: z.string().min(1, {
    message: 'Number is required',
  }),
  footed: z.string().min(1, {
    message: 'Footed is required',
  }),
  age: z.string().min(1, {
    message: 'Age is required',
  }),
  bio: z.string().min(1, {
    message: 'Bio is required',
  }),
});
