import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <div
      className='cursor-pointer mb-2 inline-flex items-center justify-center bg-primary-500 hover:bg-purple-500 text-white font-bold py-1 px-3 rounded'
      onClick={() => navigate(-1)}
    >
      <span className='mr-1'>&#8592;</span> Back
    </div>
  );
};

export default BackButton;
