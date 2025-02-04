import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

const AdminCard = ({ title, linkTo, icon: Icon, notificationCount }) => {
  return (
    <div className='transform hover:scale-105 transition-transform duration-300'>
      <Link
        to={linkTo}
        className='relative flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300'
      >
        <div className='flex items-center space-x-4'>
          {Icon && (
            <div className='relative'>
              <div className='p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg'>
                <Icon className='text-2xl text-blue-500 dark:text-blue-400' />
              </div>
              {notificationCount > 0 && (
                <div className='absolute -top-2 -right-2 flex items-center justify-center min-w-6 h-6 px-2 text-xs font-bold text-white bg-red-500 rounded-full'>
                  {notificationCount > 99 ? '99+' : notificationCount}
                </div>
              )}
            </div>
          )}
          <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
            {title}
          </h3>
        </div>
        <FaChevronRight className='text-gray-400 dark:text-gray-500' />
      </Link>
    </div>
  );
};

export default AdminCard;
