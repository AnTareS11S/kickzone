import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from '../../redux/user/userSlice';

import ModalDialog from '../ModalDialog';

const DeleteAccount = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
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
    <div>
      <h3 className='text-lg font-medium'>Account</h3>
      <p className='text-sm text-muted-foreground'>Delete your account</p>
      <ModalDialog
        title='Delete Account'
        description='This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.'
        handleClick={handleDeleteUser}
        type='button'
      />
    </div>
  );
};

export default DeleteAccount;
