/* eslint-disable react/prop-types */

import { useState } from 'react';
import ModalDialog from '../../ModalDialog';
import { useOnSuccessUpdate } from '../../hooks/useOnSuccessUpdate';

const DeleteTeam = ({ row, onTeamUpdated }) => {
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useOnSuccessUpdate(updateSuccess, () => {
    onTeamUpdated();
    setUpdateSuccess(false);
  });

  const handleDeleteTeam = async () => {
    try {
      const res = await fetch(`/api/admin/teams/delete/${row._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete team!');
      }
      const data = await res.json();
      setUpdateSuccess(true);
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
