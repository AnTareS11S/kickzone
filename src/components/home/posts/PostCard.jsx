/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
const PostCard = ({
  id,
  currentUserId,
  parentId,
  content,
  posts,
  author,
  comments,
  isComment,
}) => {
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
                className='cursor-pointer rounded-full'
              />
            </Link>
            <div className='thread-card_bar' />
          </div>
          <div className='flex flex-col w-full'>
            <Link to={`/profile/${author?._id}`} className='w-fit'>
              <h4 className='cursor-pointer text-black font-bold text-lg'>
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
                <Link to={`/post/${id}`}>
                  <img
                    src='/reply.svg'
                    alt='reply'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain'
                  />
                </Link>
              </div>
              {isComment && comments.length > 0 && (
                <Link to={`/post/${id}`}>
                  <p className='mt-1 text-subtle-medium text-gray-1'>
                    {comments.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
