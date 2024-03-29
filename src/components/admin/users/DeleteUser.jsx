import ModalDialog from '../../ModalDialog';
import { useNavigate } from 'react-router-dom';

const DeleteUser = ({ row }) => {
  const navigate = useNavigate();

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/admin/users/delete/${row._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete user!');
      }
      const data = await res.json();
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='flex items-center space-x-4'>
      <ModalDialog
        description='Are you sure you want to delete this user?'
        handleClick={handleDeleteUser}
      />
    </div>
  );
};

export default DeleteUser;
