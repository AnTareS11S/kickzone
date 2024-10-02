import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronRight } from 'react-icons/fa';

const AdminCard = ({ title, linkTo, icon: Icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Link
        to={linkTo}
        className='flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300'
      >
        <div className='flex items-center space-x-4'>
          {Icon && (
            <Icon className='text-2xl text-blue-500 dark:text-blue-400' />
          )}
          <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
            {title}
          </h3>
        </div>
        <FaChevronRight className='text-gray-400 dark:text-gray-500' />
      </Link>
    </motion.div>
  );
};

export default AdminCard;
