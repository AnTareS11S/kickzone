import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../components/Spinner';
import { Button } from '../components/ui/button';
import { FaBell, FaTimes } from 'react-icons/fa';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

const NotificationItem = ({ item, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Card className='hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800'>
      <CardContent className='p-4 relative'>
        <Button
          onClick={() => onRemove(item._id)}
          className='absolute p-1 top-2 right-2 transition-colors shadow-none bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full'
        >
          <FaTimes className='text-gray-500' />
        </Button>
        <Link to={`/post/${item.postId}`}>
          <div className='flex items-center space-x-3'>
            <div className='relative'>
              <img
                src={item.senderId?.imageUrl}
                alt='Profile'
                className='w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700'
              />
              <div
                className={`absolute -bottom-1 -right-1 p-1 rounded-full ${
                  item.type === 'comment' ? 'bg-blue-500' : ''
                }`}
              >
                {item.type === 'comment' ? (
                  <FaBell className='w-3 h-3 text-white' />
                ) : (
                  <span className='block w-3 h-3'>❤️</span>
                )}
              </div>
            </div>
            <div className='flex-1'>
              <p className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                <span className='font-semibold text-purple-600 dark:text-purple-400'>
                  {item.senderId?.username}
                </span>{' '}
                {item.type === 'comment' ? 'replied to' : 'liked'} your post
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                {new Date(item.createdAt).toLocaleString('en-UK', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </p>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  </motion.div>
);

const Notification = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiddenItems, setHiddenItems] = useState([]);

  useEffect(() => {
    const getHiddenItems = () => {
      const hiddenFromStorage =
        JSON.parse(localStorage.getItem('hiddenItems')) || [];
      setHiddenItems(hiddenFromStorage);
    };
    getHiddenItems();
  }, []);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await fetch(
          `/api/notifications/details/${currentUser?._id}`
        );
        if (!res.ok) throw new Error('Failed to fetch notifications');
        const data = await res.json();
        setNotifications(data.notifications);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?._id) getNotifications();
  }, [currentUser]);

  console.log(notifications);

  useEffect(() => {
    localStorage.setItem('hiddenItems', JSON.stringify(hiddenItems));
  }, [hiddenItems]);

  const handleRemoveItem = (id) => setHiddenItems((prev) => [...prev, id]);

  // const handleMarkAllAsRead = () => {
  //   const allIds = [...notifications?.replies, ...notifications?.likes].map(
  //     (item) => item._id
  //   );
  //   setHiddenItems(allIds);
  // };

  if (loading) return <Spinner />;

  // const visibleItems = [...notifications?.replies, ...notifications?.likes]
  // .filter((item) => !hiddenItems.includes(item._id))
  // .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <div className='max-w-7xl mx-auto px-4'>
      <Card className='bg-white dark:bg-gray-800 shadow-xl'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-2xl font-semibold text-gray-800 dark:text-gray-200'>
            Notifications
          </CardTitle>
          <Button
            // onClick={handleMarkAllAsRead}
            variant='outline'
            className='text-sm hover:bg-gray-100 dark:hover:bg-gray-700'
          >
            Mark all as read
          </Button>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <AnimatePresence>
              {notifications?.length > 0 ? (
                notifications.map((item) => (
                  <NotificationItem
                    key={item._id}
                    item={item}
                    onRemove={handleRemoveItem}
                    type={
                      notifications?.type?.some(
                        (reply) => reply._id === item._id
                      )
                        ? 'comment'
                        : 'like'
                    }
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='text-center py-8'
                >
                  <FaBell className='w-12 h-12 mx-auto text-gray-400 mb-3' />
                  <p className='text-gray-600 dark:text-gray-400'>
                    No new notifications
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notification;
