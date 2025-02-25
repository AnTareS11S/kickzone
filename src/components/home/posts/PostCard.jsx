import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaEllipsisV } from 'react-icons/fa';
import DeletePost from './DeletePost';
import BackButton from '../../BackButton';
import { useSocket } from '../../../hook/useSocket';
import ReportModal from '../../../pages/Report/ReportModal';

const CONTENT_TRUNCATE_LENGTH = 100;
const LIKE_THROTTLE_DELAY = 300;

// Animation variants for reuse
const cardAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

const optionsMenuAnimations = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const PostCard = ({
  id,
  currentUserId,
  parentId,
  content = '',
  postPhoto,
  title,
  createdAt,
  initialLikes = [],
  author,
  comments = [],
  isComment,
  setDeleteSuccess,
  mainPostAuthorId,
  currentUserImg,
  currentUsername,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  const navigate = useNavigate();
  const { socket, emit } = useSocket();

  useEffect(() => {
    setLiked(Boolean(currentUserId && initialLikes?.includes(currentUserId)));
  }, [currentUserId, initialLikes]);

  const handleNotifications = useCallback(
    async (isLiking) => {
      if (!socket || currentUserId === author?._id) return;

      emit('newUnreadNotification', {
        userId: currentUserId,
        authorId: author?._id,
        postId: id,
        type: 'like',
        userImg: currentUserImg,
        username: currentUsername,
        action: isLiking ? 'create' : 'delete',
      });
    },
    [
      socket,
      currentUserId,
      author?._id,
      id,
      emit,
      currentUserImg,
      currentUsername,
    ]
  );

  const handleLikeToggle = useCallback(async () => {
    if (!currentUserId) {
      navigate('/sign-in');
      return;
    }

    if (isLikeProcessing) return;

    setIsLikeProcessing(true);

    try {
      const isLiking = !liked;
      const endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/post/${
        isLiking ? 'like' : 'unlike'
      }/${id}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (res.ok) {
        setLiked((prev) => !prev);
        setLikes((prev) =>
          isLiking
            ? [...prev, currentUserId]
            : prev.filter((userId) => userId !== currentUserId)
        );

        await handleNotifications(isLiking);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setTimeout(() => setIsLikeProcessing(false), LIKE_THROTTLE_DELAY);
    }
  }, [
    currentUserId,
    id,
    liked,
    isLikeProcessing,
    navigate,
    handleNotifications,
  ]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-UK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const truncateContent = useCallback((text, maxLength) => {
    if (text.length <= maxLength) return text;
    return `${text.substr(0, maxLength)}...`;
  }, []);

  const renderPostContent = () => (
    <div>
      <Link to={`/post/${id}`}>
        <h3 className='text-xl font-bold mb-2 text-gray-800 dark:text-white'>
          {title}
        </h3>
        <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>
          {isExpanded
            ? content
            : truncateContent(content, CONTENT_TRUNCATE_LENGTH)}
        </p>
        {content.length > CONTENT_TRUNCATE_LENGTH && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            className='text-primary-500 hover:text-primary-600 text-sm font-medium'
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </Link>
    </div>
  );

  const renderPostHeader = () => (
    <div className='flex items-center justify-between mb-2'>
      <Link to={`/profile/${author?._id}`}>
        <div className='flex items-center space-x-2'>
          <img
            src={
              author?.imageUrl ||
              'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
            }
            alt={author?.username}
            className='w-8 h-8 rounded-full border-2 border-primary-500'
            loading='lazy'
          />
          <span className='font-medium text-gray-700 dark:text-gray-300'>
            {author?.username}
          </span>
        </div>
      </Link>
      <span className='text-xs text-gray-500 dark:text-gray-400'>
        {formatDate(createdAt)}
      </span>
    </div>
  );

  const renderPostActions = () => (
    <div className='flex items-center justify-between mt-4'>
      <div className='flex space-x-4'>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLikeToggle}
          className={`flex items-center space-x-1 ${
            liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
          } ${
            !currentUserId || isLikeProcessing
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
          disabled={!currentUserId || isLikeProcessing}
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
        {currentUserId && currentUserId !== author?._id && (
          <ReportModal
            currentUserId={currentUserId}
            reportedUserId={author?._id}
            contentType={isComment ? 'Comment' : 'Post'}
            contentId={id}
          />
        )}
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
                {...optionsMenuAnimations}
                className='absolute right-3 bottom-5 w-30 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-300 dark:border-gray-600 z-50'
              >
                <Link
                  to={
                    !isComment ? `/post/edit/${id}` : `/post/comment/edit/${id}`
                  }
                  className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                >
                  Edit Post
                </Link>
                <DeletePost
                  postId={id}
                  parentId={parentId}
                  isComment={isComment}
                  authorId={isComment ? mainPostAuthorId : author?._id}
                  userId={currentUserId}
                  setDeleteSuccess={setDeleteSuccess}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );

  return (
    <>
      {parentId && !mainPostAuthorId && (
        <div>
          <BackButton to={`/post/${parentId}`} />
        </div>
      )}
      <motion.div
        {...cardAnimations}
        className='bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 mb-6'
      >
        <div className='flex flex-col md:flex-row'>
          {postPhoto && (
            <div className='md:w-1/3 relative'>
              <img
                src={postPhoto}
                alt='Post'
                className='w-full h-48 md:h-full object-cover'
                loading='lazy'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
            </div>
          )}

          <div className='flex-1 p-4 flex flex-col justify-between'>
            {renderPostHeader()}
            {renderPostContent()}
            {renderPostActions()}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default PostCard;
