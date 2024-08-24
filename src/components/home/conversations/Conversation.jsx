import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const Conversation = ({ conversation }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(
          `/api/user/get-user-info/${currentUser?._id}?conversationId=${conversation._id}`
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className='flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100'
    >
      <img
        src={
          user?.imageUrl ||
          'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
        }
        alt={user?.name}
        className='mr-2 w-10 h-10 rounded-full object-cover'
      />
      <div>
        <div className='font-semibold'>
          {user?.name} {user?.surname}
        </div>
      </div>
    </motion.div>
  );
};

export default Conversation;
