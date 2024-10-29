import { FaReply } from 'react-icons/fa';
import { Card, CardContent } from '../../ui/card';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotificationItem = ({ item, onRead }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Card
        className={`hover:shadow-lg transition-all duration-300 border-l-4 ${
          item.isRead
            ? 'bg-gray-50 dark:bg-gray-800 border-l-transparent'
            : 'bg-white dark:bg-gray-700 border-l-blue-500'
        } `}
      >
        <CardContent className='p-4 relative'>
          <Link
            to={`/post/${item.postId}`}
            onClick={() => onRead(item._id)}
            className={'block'}
          >
            <div className='flex items-center space-x-3'>
              <div className='relative'>
                <img
                  src={item.senderId?.imageUrl}
                  alt='Profile'
                  className={`w-10 h-10 rounded-full object-cover border-2 transition-all duration-300 ${
                    item.isRead
                      ? 'border-gray-200 dark:border-gray-600'
                      : 'border-blue-100 dark:border-blue-900'
                  }`}
                />
                <div
                  className={`absolute -bottom-1 -right-1 p-1 rounded-full ${
                    item.type === 'comment' ? 'bg-blue-500' : ''
                  }`}
                >
                  {item.type === 'comment' ? (
                    <FaReply className='w-3 h-3 text-white' />
                  ) : (
                    <span className='block w-3 h-3'>❤️</span>
                  )}
                </div>
                {!item.isRead && (
                  <div className='absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse' />
                )}
              </div>
              <div className='flex-1 space-y-1'>
                <p
                  className={`text-sm ${
                    item.isRead
                      ? 'text-gray-600 font-normal'
                      : 'text-gray-800 font-medium'
                  } dark:text-gray-200`}
                >
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
              {!item.isRead && (
                <div className='shrink-0'>
                  <span className='inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200'>
                    New
                  </span>
                </div>
              )}
            </div>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationItem;
