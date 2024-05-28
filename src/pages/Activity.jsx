import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { Button } from '../components/ui/button';
import { FaTimes } from 'react-icons/fa';

const Activity = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiddenReplies, setHiddenReplies] = useState([]);
  const [hiddenLikes, setHiddenLikes] = useState([]);

  useEffect(() => {
    const getHiddenItems = () => {
      const hiddenRepliesFromStorage =
        JSON.parse(localStorage.getItem('hiddenReplies')) || [];
      const hiddenLikesFromStorage =
        JSON.parse(localStorage.getItem('hiddenLikes')) || [];
      setHiddenReplies(hiddenRepliesFromStorage);
      setHiddenLikes(hiddenLikesFromStorage);
    };
    getHiddenItems();
  }, []);

  useEffect(() => {
    const getActivity = async () => {
      try {
        const response = await fetch(`/api/user/activity/${currentUser._id}`);
        const data = await response.json();
        setActivity(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    getActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('hiddenReplies', JSON.stringify(hiddenReplies));
  }, [hiddenReplies]);

  useEffect(() => {
    localStorage.setItem('hiddenLikes', JSON.stringify(hiddenLikes));
  }, [hiddenLikes]);

  const handleRemoveReply = (id) => {
    setHiddenReplies((prevHiddenReplies) => [...prevHiddenReplies, id]);
  };

  const handleRemoveLike = (id) => {
    setHiddenLikes((prevHiddenLikes) => [...prevHiddenLikes, id]);
  };

  if (loading) {
    return <Spinner />;
  }

  const visibleReplies = activity.replies.filter(
    (reply) => !hiddenReplies.includes(reply._id)
  );
  const visibleLikes = activity.likes.filter(
    (like) => !hiddenLikes.includes(like._id)
  );

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h1 className='text-2xl font-semibold text-gray-800 mb-4'>Activity</h1>
      <div className='border-b border-gray-300 mb-6'></div>

      {visibleReplies?.length > 0 && (
        <div>
          <h2 className='text-lg font-semibold text-gray-700 mb-4'>Replies</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {visibleReplies?.map((reply) => (
              <div
                key={reply._id}
                className='bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors duration-300 relative'
              >
                <Button
                  onClick={() => handleRemoveReply(reply._id)}
                  className='absolute p-1 top-1 right-1 transition-colors shadow-none bg-transparent hover:bg-0'
                >
                  <FaTimes className='text-gray-500 cursor-pointer' />
                </Button>
                <Link key={reply._id} to={`/post/${reply.parentId}`}>
                  <div className='flex items-center'>
                    <img
                      src={reply.author.imageUrl}
                      alt='Profile picture'
                      width={32}
                      height={32}
                      className='rounded-full object-cover mr-3'
                    />
                    <p className='text-sm text-gray-800'>
                      <span className='font-semibold text-purple-600'>
                        {reply.author.username}
                      </span>{' '}
                      replied to your post
                    </p>
                  </div>
                  <p className='text-sm text-gray-600 ml-auto'>
                    {new Date(reply.updatedAt).toLocaleString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {visibleLikes?.length > 0 && (
        <div className='mt-8'>
          <h2 className='text-lg font-semibold text-gray-700 mb-4'>Likes</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {visibleLikes?.map((like) => (
              <div
                key={like._id}
                className='bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors duration-300 relative'
              >
                <Button
                  onClick={() => handleRemoveLike(like._id)}
                  className='absolute p-1 top-1 right-1 transition-colors shadow-none bg-transparent hover:bg-0'
                >
                  <FaTimes className='text-gray-500 cursor-pointer' />
                </Button>
                <Link key={like._id} to={`/post/${like._id}`}>
                  <div className='flex items-center'>
                    <img
                      src={like.author.imageUrl}
                      alt='Profile picture'
                      width={32}
                      height={32}
                      className='rounded-full object-cover mr-3'
                    />
                    <p className='text-sm text-gray-800'>
                      <span className='font-semibold text-purple-600'>
                        {like.author.username}
                      </span>{' '}
                      liked your post
                    </p>
                  </div>
                  <p className='text-sm text-gray-600 ml-auto'>
                    {new Date(like.updatedAt).toLocaleString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {visibleReplies.length === 0 && visibleLikes?.length === 0 && (
        <p className='text-gray-600 text-center'>No activity yet</p>
      )}
    </div>
  );
};

export default Activity;
