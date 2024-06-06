import * as z from 'zod';
export const usersFormSchema = (isEdit) =>
  z.object({
    name: z
      .string()
      .min(1, {
        message: 'Name must be at least 4 characters.',
      })
      .max(30, {
        message: 'Name must not be longer than 30 characters.',
      }),
    surname: z
      .string()
      .min(1, {
        message: 'Surname must be at least 4 characters.',
      })
      .max(30, {
        message: 'Surname must not be longer than 30 characters.',
      }),
    birthDate: z.coerce.date().refine(
      (val) => {
        const date = new Date(val);
        const today = new Date();
        return date.getTime() <= today.getTime();
      },
      {
        message: 'Birth date must be in the past or today',
      }
    ),
    nationality: z.string().min(1, {
      message: 'Nationality is required',
    }),
    city: z.string().min(1, {
      message: 'City is required',
    }),
    photo: isEdit
      ? z.any().nullable()
      : z.instanceof(File, {
          message: 'Photo is required',
        }),
    bio: z.string().min(1, {
      message: 'Bio is required',
    }),
  });

export const roleFormSchema = () =>
  z.object({
    role: z.string().min(1, {
      message: 'Role is required',
    }),
  });
