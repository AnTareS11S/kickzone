import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from '../../redux/user/userSlice';
import ModalDialog from '../ModalDialog';
import { Card } from '../ui/card';

const DeleteAccount = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/delete/${
          currentUser._id
        }`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
      navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <Card className='px-4 py-8'>
      <h2 className='text-xl font-bold mb-4'>Account Settings</h2>
      <div className='mb-6'>
        <h3 className='text-lg font-medium'>Delete Account</h3>
        <p className='text-gray-500'>
          Delete your account and remove your data from our servers.
        </p>
      </div>
      <ModalDialog
        title='Delete Account'
        description='This action cannot be undone. This will permanently delete your account and remove your data from our servers.'
        handleClick={handleDeleteUser}
        type='button'
        className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded'
      >
        Delete Account
      </ModalDialog>
    </Card>
  );
};

export default DeleteAccount;
