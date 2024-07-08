import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaEllipsisV } from 'react-icons/fa';
import DeletePost from './DeletePost';

const PostCard = ({
  id,
  currentUserId,
  parentId,
  content,
  postPhoto,
  title,
  createdAt,
  initialLikes,
  author,
  comments,
  isComment,
  setDeleteSuccess,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLiked(currentUserId && initialLikes?.includes(currentUserId));
  }, [currentUserId, initialLikes]);

  const handleLikeToggle = async () => {
    if (!currentUserId) {
      navigate('/sign-in');
      return;
    }
    try {
      const endpoint = liked
        ? `/api/post/unlike/${id}`
        : `/api/post/like/${id}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (res.ok) {
        setLiked(!liked);
        setLikes((prev) =>
          liked
            ? prev.filter((userId) => userId !== currentUserId)
            : [...prev, currentUserId]
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const truncateContent = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 mb-6'
    >
      <div className='flex flex-col md:flex-row'>
        {postPhoto && (
          <div className='md:w-1/3 relative'>
            <img
              src={postPhoto}
              alt='Post'
              className='w-full h-48 md:h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
          </div>
        )}
        <div className='flex-1 p-4 flex flex-col justify-between'>
          <div>
            <div className='flex items-center justify-between mb-2'>
              <Link to={`/profile/${author?._id}`}>
                <div className='flex items-center space-x-2'>
                  <img
                    src={author?.imageUrl}
                    alt={author?.username}
                    className='w-8 h-8 rounded-full border-2 border-primary-500'
                  />
                  <span className='font-medium text-gray-700 dark:text-gray-300'>
                    {author?.username}
                  </span>
                </div>
              </Link>
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                {new Date(createdAt).toLocaleString('en-UK', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </span>
            </div>
            <Link to={`/post/${id}`}>
              <h3 className='text-xl font-bold mb-2 text-gray-800 dark:text-white'>
                {title}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>
                {isExpanded ? content : truncateContent(content, 100)}
              </p>
              {content.length > 100 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className='text-primary-500 hover:text-primary-600 text-sm font-medium'
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </Link>
          </div>
          <div className='flex items-center justify-between mt-4'>
            <div className='flex space-x-4'>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLikeToggle}
                className={`flex items-center space-x-1 ${
                  liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                } ${!currentUserId ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!currentUserId}
              >
                {liked ? <FaHeart /> : <FaRegHeart />}
                <span>{likes?.length || 0}</span>
              </motion.button>
              <Link
                to={`/post/${id}`}
                className='flex items-center space-x-1 text-gray-500 dark:text-gray-400'
              >
                <FaComment />
                <span>{comments?.length || 0}</span>
              </Link>
            </div>
            {currentUserId === author?._id && (
              <div className='relative'>
                <FaEllipsisV
                  onClick={() => setShowOptions(!showOptions)}
                  className='cursor-pointer text-gray-500 dark:text-gray-400'
                />

                <AnimatePresence>
                  {showOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className='absolute right-3 bottom-5 w-30 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-300 dark:border-gray-600 z-50'
                    >
                      <>
                        <Link
                          to={
                            !isComment
                              ? `/post/edit/${id}`
                              : `/post/comment/edit/${id}`
                          }
                          className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                        >
                          Edit Post
                        </Link>
                        <DeletePost
                          postId={id}
                          parentId={parentId}
                          isComment={isComment}
                          setDeleteSuccess={setDeleteSuccess}
                        />
                      </>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
