import { Link } from 'react-router-dom';

const AdminCard = ({ title, linkTo }) => {
  return (
    <Link
      to={linkTo}
      className='flex flex-col items-center justify-center gap-2 rounded-lg bg-white p-6 shadow-md transition-colors duration-200 hover:bg-gray-100'
    >
      <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
    </Link>
  );
};

export default AdminCard;
