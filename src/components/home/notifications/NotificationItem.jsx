import { FaReply } from 'react-icons/fa';
import { Card, CardContent } from '../../ui/card';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotificationItem = ({ item, onRead }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Card
      className={`hover:shadow-lg transition-shadow duration-300
        ${
          item.isRead
            ? 'bg-gray-50 dark:bg-gray-800'
            : 'bg-white dark:bg-gray-700'
        }`}
    >
      <CardContent className='p-4 relative'>
        <Link
          to={`/post/${item.postId}`}
          onClick={() => onRead(item._id)}
          className='block'
        >
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
                  <FaReply className='w-3 h-3 text-white' />
                ) : (
                  <span className='block w-3 h-3'>❤️</span>
                )}
              </div>
              {!item.isRead && (
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full' />
              )}
            </div>
            <div className='flex-1'>
              <p
                className={`text-sm font-medium ${
                  item.isRead ? 'text-gray-600' : 'text-gray-800'
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
          </div>
        </Link>
      </CardContent>
    </Card>
  </motion.div>
);

export default NotificationItem;
