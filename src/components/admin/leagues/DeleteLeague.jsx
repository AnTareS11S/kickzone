/* eslint-disable react/prop-types */

import ModalDialog from '../../ModalDialog';

const DeleteLeague = ({ row }) => {
  const id = row.original._id;

  const handleDeleteLeague = async () => {
    try {
      const res = await fetch(`/api/admin/leagues/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete league!');
      }
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='flex items-center space-x-4'>
      <ModalDialog
        description='Are you sure you want to delete this league?'
        handleClick={handleDeleteLeague}
      />
    </div>
  );
};

export default DeleteLeague;
