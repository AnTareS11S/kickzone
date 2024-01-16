/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import DeletePost from './DeletePost';
import { useState } from 'react';
const PostCard = ({
  id,
  currentUserId,
  parentId,
  content,
  posts,
  author,
  comments,
  isComment,
  setDeleteSuccess,
}) => {
  const link = currentUserId ? `/post/${id}` : '/sign-in';

  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? 'px-0 xs:px-7' : 'bg-slate-200 p-7'
      }`}
    >
      <div className='flex justify-between items-center'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link to={`/profile/${author?._id}`} className='relative h-11 w-11'>
              <img
                src={author?.photo}
                alt='user'
                className='cursor-pointer rounded-full h-11 w-11'
              />
            </Link>
            <div className='thread-card_bar' />
          </div>
          <div className='flex flex-col w-full'>
            <Link to={`/profile/${author?._id}`} className='w-fit'>
              <h4 className='cursor-pointer text-base-semibold text-dark-1'>
                {author?.username}
              </h4>
            </Link>
            <p className='mt-2 text-small-regular text-light-3'>{content}</p>

            <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
              <div className='flex gap-3.5'>
                <img
                  src='/heart-gray.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
                <Link to={link}>
                  <img
                    src='/reply.svg'
                    alt='reply'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain'
                  />
                </Link>
              </div>
              {isComment && comments?.length > 0 && (
                <Link to={link}>
                  <p className='mt-1 text-subtle-medium text-gray-1'>
                    {comments?.length} repl{comments?.length > 1 ? 'ies' : 'y'}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
        <DeletePost
          postId={id}
          currentUserId={currentUserId}
          authorId={author?._id}
          parentId={parentId}
          isComment={isComment}
          setDeleteSuccess={setDeleteSuccess}
        />
      </div>

      {!isComment && comments?.length > 0 && (
        <div className='ml-1 mt-3 flex items-center gap-2'>
          {comments?.slice(0, 2).map((comment, index) => (
            <img
              key={index}
              src={comment.author.photo}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && '-ml-5'} rounded-full w-6 h-6`}
            />
          ))}
          <Link to={link}>
            <p className='mt-1 text-subtle-medium text-gray-1'>
              {comments?.length} repl{comments?.length > 1 ? 'ies' : 'y'}
            </p>
          </Link>
        </div>
      )}
    </article>
  );
};

export default PostCard;
