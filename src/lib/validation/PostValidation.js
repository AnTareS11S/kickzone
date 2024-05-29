import * as z from 'zod';

export const postFormSchema = (isEdit) =>
  z.object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters long')
      .max(50, 'Title must be less than 50 characters long'),
    postContent: z
      .string()
      .min(3, 'Content must be at least 3 characters long'),
    postPhoto: isEdit
      ? z.any().nullable()
      : z.instanceof(File, {
          message: 'Photo is required',
        }),
  });

export const CommentValidation = z.object({
  post: z.string().min(3, { message: 'Minimum 3 characters' }),
});
