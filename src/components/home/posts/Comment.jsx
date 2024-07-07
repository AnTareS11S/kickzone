import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CommentValidation } from '../../../lib/validation/PostValidation';
import { motion } from 'framer-motion';
import { FaReply } from 'react-icons/fa';

const Comment = ({ postId, currentUserImg, setUpdateSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      post: '',
    },
  });

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/post/comment/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentContent: formData.post,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit comment');
      }

      setUpdateSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg p-4 mb-6'
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex items-start space-x-4'
      >
        <img
          src={currentUserImg || 'https://via.placeholder.com/40'}
          alt='Profile'
          className='w-10 h-10 rounded-full object-cover'
        />
        <div className='flex-grow'>
          <textarea
            {...register('post')}
            placeholder='Write a comment...'
            className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white'
            rows='2'
          />
          {errors.post && (
            <p className='text-red-500 text-sm mt-1'>{errors.post.message}</p>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          type='submit'
          disabled={!isValid}
          className={`flex items-center justify-center px-4 py-2 rounded-lg text-white ${
            isValid
              ? 'bg-primary-500 hover:bg-purple-500'
              : 'bg-gray-400 cursor-not-allowed'
          } transition-colors duration-200`}
          onClick={() => isValid && setUpdateSuccess(false)}
        >
          <FaReply className='mr-2' />
          Reply
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Comment;
