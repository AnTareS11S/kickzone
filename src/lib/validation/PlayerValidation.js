import * as z from 'zod';

export const playerFormSchema = (isEdit) =>
  z.object({
    name: z.string().min(1, {
      message: 'Name is required',
    }),
    surname: z.string().min(1, {
      message: 'Surname is required',
    }),
    nationality: z.string().min(1, {
      message: 'Nationality is required',
    }),
    height: z.any().refine(
      (value) => {
        const parsedValue =
          typeof value === 'string' ? parseInt(value, 10) : value;

        return !isNaN(parsedValue) && parsedValue > 0;
      },
      {
        message: 'Height must be a positive integer',
      }
    ),
    weight: z.any().refine(
      (value) => {
        const parsedValue =
          typeof value === 'string' ? parseInt(value, 10) : value;

        return !isNaN(parsedValue) && parsedValue > 0;
      },
      {
        message: 'Weight must be a positive integer',
      }
    ),
    position: z.string().min(1, {
      message: 'Position is required',
    }),
    number: z.any().refine(
      (value) => {
        const parsedValue =
          typeof value === 'string' ? parseInt(value, 10) : value;

        return !isNaN(parsedValue) && parsedValue > 0;
      },
      {
        message: 'Number must be a positive integer',
      }
    ),
    footed: z.string().min(1, {
      message: 'Footed is required',
    }),
    wantedTeam: z.string().optional(),
    age: z.any().refine(
      (value) => {
        const parsedValue =
          typeof value === 'string' ? parseInt(value, 10) : value;

        return !isNaN(parsedValue) && parsedValue > 0;
      },
      {
        message: 'Age must be a positive integer',
      }
    ),
    photo: isEdit
      ? z.any().nullable()
      : z.instanceof(File, {
          message: 'Photo is required',
        }),
    bio: z.string().min(1, {
      message: 'Bio is required',
    }),
  });
