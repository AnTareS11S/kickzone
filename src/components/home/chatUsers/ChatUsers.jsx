import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Input } from '../../ui/input';
import { motion, AnimatePresence } from 'framer-motion';

const ChatUsers = ({
  currentId,
  setCurrentChat,
  onSelectUser,
  setIsConversationOpen,
}) => {
  const [allUsers, setAllUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAccounts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/user/get-accounts?term=${searchTerm}`
        );
        if (!res.ok) throw new Error('Failed to fetch accounts');
        const data = await res.json();
        setAllUsers(data.filter((u) => u._id !== currentId));
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      if (searchTerm) getAccounts();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, currentId]);

  useEffect(() => {
    setOnlineUsers(allUsers.filter((u) => onlineUsers.includes(u._id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = async (user) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/conversations/find/${currentId}/${user._id}`
      );
      if (!res.ok) throw new Error('Failed to fetch conversation');
      const data = await res.json();
      setCurrentChat(data);
      setIsConversationOpen(true);
      onSelectUser(user);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  return (
    <div className='mb-6'>
      <div className='relative mb-4'>
        <Input
          type='text'
          placeholder='Search users...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-10 w-full py-2 px-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        <FiSearch
          className='absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 '
          size={18}
        />
      </div>
      <AnimatePresence>
        {searchTerm.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='bg-white rounded-lg shadow-md overflow-hidden'
          >
            {isLoading ? (
              <div className='flex items-center justify-center p-4 text-center'>
                <div className='flex items-center space-x-2'>
                  <div className='w-5 h-5 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin'></div>
                  <span className='text-gray-500'>Searching...</span>
                </div>
              </div>
            ) : allUsers.length > 0 ? (
              allUsers.map((u) => (
                <motion.div
                  key={u._id}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  onClick={() => handleClick(u)}
                  className='flex items-center p-3 cursor-pointer border-b border-gray-100 last:border-b-0'
                >
                  <img
                    src={
                      u.imageUrl ||
                      'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
                    }
                    alt={`${u.name} ${u.surname}`}
                    className='w-10 h-10 rounded-full mr-3 object-cover'
                  />

                  <div>
                    <h3 className='font-medium text-gray-800'>{`${u.name} ${u.surname}`}</h3>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className='text-center py-4 text-gray-500'>
                No users found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatUsers;
