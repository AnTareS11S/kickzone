/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useOnSuccessUpdate } from './hooks/useOnSuccessUpdate';
import ModalDialog from './ModalDialog';

const DeleteEntity = ({ row, onEntityDelete, apiEndpoint }) => {
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useOnSuccessUpdate(updateSuccess, () => {
    onEntityDelete();
    setUpdateSuccess(false);
  });

  const handleDeleteEntity = async () => {
    try {
      const res = await fetch(
        `/api/admin/${apiEndpoint?.split('/')[0]}/delete/${row._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `Failed to delete ${apiEndpoint}!`);
      }
      setUpdateSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex items-center space-x-4'>
      <ModalDialog
        description={`Are you sure you want to delete this ${
          apiEndpoint?.split('/')[0]
        }?`}
        handleClick={handleDeleteEntity}
      />
    </div>
  );
};

export default DeleteEntity;
