import * as z from 'zod';

export const PostValidation = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters long')
    .max(30, 'Title must be less than 30 characters long'),
  postContent: z
    .string()
    .min(10, 'Content must be at least 10 characters long'),
  postPhoto: z.string().optional(),
});

export const CommentValidation = z.object({
  post: z.string().min(3, { message: 'Minimum 3 characters' }),
});
