import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const Conversation = ({ conversation, isActive, isUnread }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/get-user-info/${
            currentUser?._id
          }?conversationId=${conversation._id}`
        );
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getUser();
  }, [conversation, currentUser]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200 group ${
        isActive ? 'bg-blue-100' : 'hover:bg-gray-100'
      }`}
    >
      <div className='flex items-center flex-grow mr-2'>
        <div className='relative'>
          <img
            src={
              user?.imageUrl ||
              'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
            }
            alt={user?.name}
            className='mr-3 w-10 h-10 rounded-full object-cover'
          />
          {isUnread && (
            <div className='absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white'></div>
          )}
        </div>

        <div className='flex-grow min-w-0'>
          <div className='font-semibold truncate flex items-center'>
            {user?.name} {user?.surname}
            {isUnread && (
              <span className='ml-2 text-xs text-blue-500 font-normal'>
                New
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Conversation;
