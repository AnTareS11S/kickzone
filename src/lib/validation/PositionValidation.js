import * as z from 'zod';

export const positionFormSchema = (isEdit) =>
  z.object({
    name: z
      .string()
      .min(1, {
        message: 'Position name must be at least 4 characters.',
      })
      .max(30, {
        message: 'Postion name must not be longer than 30 characters.',
      })
      .refine(
        async (value) => {
          const res = await fetch('/api/admin/position/check', {
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
          message: 'Position name already exists.',
        }
      ),
    shortcut: z
      .string()
      .min(2, {
        message: 'Position shortcut must be at least 1 characters.',
      })
      .max(10, {
        message: 'Position shortcut must not be longer than 5 characters.',
      })
      .refine(
        async (value) => {
          const res = await fetch('/api/admin/position/check', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ shortcut: value, isEdit }),
          });
          const data = await res.json();
          return data.success;
        },
        {
          message: 'Position shortcut already exists.',
        }
      ),
  });
