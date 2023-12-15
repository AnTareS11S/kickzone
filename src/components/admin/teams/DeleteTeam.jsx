/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import ModalDialog from '../../ModalDialog';

const DeleteTeam = ({ row }) => {
  const id = row.original._id;
  const navigate = useNavigate();

  const handleDeleteTeam = async () => {
    try {
      const res = await fetch(`/api/admin/teams/delete/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete team!');
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
        description='Are you sure you want to delete this team?'
        handleClick={handleDeleteTeam}
      />
    </div>
  );
};

export default DeleteTeam;
