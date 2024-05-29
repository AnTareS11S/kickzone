import { Link } from 'react-router-dom';
import DeletePost from './DeletePost';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { FaHeart, FaRegHeart, FaReply, FaEdit } from 'react-icons/fa';

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
  const link = currentUserId ? `/post/${id}` : '/sign-in';
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (currentUserId && initialLikes && initialLikes.includes(currentUserId)) {
      setLiked(true);
    }
  }, [currentUserId, initialLikes]);

  const handleAddLike = async () => {
    try {
      const res = await fetch(`/api/post/like/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (res.ok) {
        setLiked(true);
        setLikes((likes) => [...likes, currentUserId]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveLike = async () => {
    try {
      const res = await fetch(`/api/post/unlike/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (res.ok) {
        setLiked(false);
        setLikes((likes) => likes.filter((userId) => userId !== currentUserId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className='bg-white shadow-md rounded-lg mb-4'>
      <CardHeader className='flex px-4 py-2 border-b border-gray-200'>
        <Link
          to={`/profile/${author?._id}`}
          className='relative h-10 w-10 mr-3'
        >
          <img
            src={author?.imageUrl}
            alt='user'
            className='cursor-pointer rounded-full h-10 w-10'
          />
        </Link>
        <Link
          to={`/profile/${author?._id}`}
          className='font-semibold text-gray-800'
        >
          {author?.username}
        </Link>
      </CardHeader>

      <CardContent className='p-4'>
        <Link
          to={link}
          className='flex flex-col md:flex-row items-center justify-center w-full'
        >
          {!isComment && !parentId && (
            <div className='md:w-1/2 mb-4 md:mb-0 md:mr-4'>
              <img
                src={postPhoto}
                alt='postPhoto'
                className='object-contain w-full h-full rounded-lg'
              />
            </div>
          )}
          <div className={`${isComment || parentId ? 'w-full' : 'md:w-1/2'}`}>
            <h4 className='text-lg font-semibold mb-2'>{title}</h4>
            <p className='text-gray-700 break-words'>{content}</p>
          </div>
        </Link>

        <div className='mt-4 flex items-center justify-between'>
          <div className='flex items-center'>
            <div
              className='flex items-center mr-4 cursor-pointer'
              onClick={liked ? handleRemoveLike : handleAddLike}
            >
              {liked ? (
                <FaHeart className='text-red-500 mr-1' />
              ) : (
                <FaRegHeart className='text-gray-500 mr-1' />
              )}
              <span className='text-gray-600'>{likes?.length}</span>
            </div>

            <Link to={link} className='flex items-center mr-4 cursor-pointer'>
              <FaReply className='text-gray-500 mr-1' />
              <span className='text-gray-600'>Reply</span>
            </Link>

            {currentUserId === author?._id ? (
              <Link
                to={
                  !isComment ? `/post/edit/${id}` : `/post/comment/edit/${id}`
                }
                className='flex items-center cursor-pointer'
              >
                <FaEdit className='text-gray-500 mr-1' />
                <span className='text-gray-600'>Edit</span>
              </Link>
            ) : null}
          </div>

          <div className='text-gray-500'>
            {new Date(createdAt).toLocaleString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </div>

          <div className='flex items-center'>
            <DeletePost
              postId={id}
              currentUserId={currentUserId}
              authorId={author?._id}
              parentId={parentId}
              isComment={isComment}
              setDeleteSuccess={setDeleteSuccess}
            />
          </div>
        </div>

        {isComment && comments?.length > 0 && (
          <Link to={link} className='mt-2 flex items-center'>
            <span className='text-gray-600'>
              {comments?.length} repl{comments?.length > 1 ? 'ies' : 'y'}
            </span>
          </Link>
        )}
      </CardContent>

      {!isComment && comments?.length > 0 && (
        <div className='flex items-center ml-4 mt-2 p-1'>
          {comments?.slice(0, 2).map((comment, index) => (
            <img
              key={index}
              src={comment?.author?.imageUrl}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && '-ml-2'} rounded-full w-6 h-6`}
            />
          ))}
          <Link to={link} className='ml-2 text-gray-600'>
            {comments?.length} repl{comments?.length > 1 ? 'ies' : 'y'}
          </Link>
        </div>
      )}
    </Card>
  );
};

export default PostCard;
