import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ to }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to ? to : -1)}
      className='inline-flex items-center px-3 py-2 mb-4 text-sm font-medium transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
    >
      <FaArrowLeft className='w-4 h-4 mr-2' />
      Back
    </button>
  );
};

export default BackButton;
