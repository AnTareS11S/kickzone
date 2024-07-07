import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
  FaEllipsisV,
} from 'react-icons/fa';
import DeletePost from './DeletePost';

const PostCard = ({
  id,
  currentUserId,
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

  useEffect(() => {
    setLiked(currentUserId && initialLikes?.includes(currentUserId));
  }, [currentUserId, initialLikes]);

  const handleLikeToggle = async () => {
    if (!currentUserId) return;
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
      <div className='relative'>
        {postPhoto && (
          <img
            src={postPhoto}
            alt='Post'
            className='w-full h-48 object-cover'
          />
        )}
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-60' />
        <div className='absolute bottom-0 left-0 p-4 text-white'>
          <h3 className='text-xl font-bold mb-1'>{title}</h3>
          <div className='flex items-center space-x-2'>
            <img
              src={author?.imageUrl}
              alt={author?.username}
              className='w-8 h-8 rounded-full border-2 border-white'
            />
            <span className='text-sm'>{author?.username}</span>
          </div>
        </div>
      </div>

      <div className='p-4'>
        <p className='text-gray-700 dark:text-gray-300 text-sm'>
          {isExpanded ? content : truncateContent(content, 100)}
        </p>
        {content.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='text-blue-500 hover:text-blue-600 text-sm mt-2'
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      <div className='px-4 pb-4 flex items-center justify-between'>
        <div className='flex space-x-4'>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLikeToggle}
            className={`flex items-center space-x-1 ${
              liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
            }`}
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
          <motion.button
            whileTap={{ scale: 0.9 }}
            className='text-gray-500 dark:text-gray-400'
          >
            <FaShare />
          </motion.button>
        </div>
        <div className='relative'>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowOptions(!showOptions)}
            className='text-gray-500 dark:text-gray-400'
          >
            <FaEllipsisV />
          </motion.button>
          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10'
              >
                {currentUserId === author?._id && (
                  <Link
                    to={`/post/edit/${id}`}
                    className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                  >
                    Edit Post
                  </Link>
                )}
                <DeletePost
                  postId={id}
                  currentUserId={currentUserId}
                  authorId={author?._id}
                  isComment={isComment}
                  setDeleteSuccess={setDeleteSuccess}
                  className='block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
