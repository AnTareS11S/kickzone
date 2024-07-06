import * as z from 'zod';

export const positionFormSchema = () =>
  z.object({
    name: z
      .string()
      .min(1, {
        message: 'Position name must be at least 4 characters.',
      })
      .max(30, {
        message: 'Postion name must not be longer than 30 characters.',
      }),
    shortcut: z
      .string()
      .min(2, {
        message: 'Position shortcut must be at least 1 characters.',
      })
      .max(10, {
        message: 'Position shortcut must not be longer than 5 characters.',
      }),
  });

export const formationFormSchema = () =>
  z.object({
    name: z
      .string()
      .min(2, {
        message: 'Formation name must be at least 2 characters.',
      })
      .max(30, {
        message: 'Formation name must not be longer than 30 characters.',
      }),
    description: z
      .string()
      .min(2, {
        message: 'Formation description must be at least 2 characters.',
      })
      .max(100, {
        message:
          'Formation description must not be longer than 100 characters.',
      }),
    positions: z.array(
      z.object({
        name: z.string(),
        x: z.number(),
        y: z.number(),
      })
    ),
  });
