import * as z from 'zod';

export const forumFormSchema = () =>
  z.object({
    title: z
      .string()
      .min(5, 'Title must be at least 5 characters')
      .max(100, 'Title must be at most 100 characters'),
    category: z.string().min(1, 'Category must be selected'),
    content: z
      .string()
      .min(20, 'Content must be at least 20 characters')
      .max(400, 'Content must be at most 400 characters'),
  });
