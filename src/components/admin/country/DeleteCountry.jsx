/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import ModalDialog from '../../ModalDialog';

const DeleteCountry = ({ row, onCountryUpdated }) => {
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (updateSuccess) {
      onCountryUpdated();
      setUpdateSuccess(false);
    }
  }, [updateSuccess, onCountryUpdated]);

  const handleDeleteCountry = async () => {
    try {
      const res = await fetch(`/api/admin/country/delete/${row._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete league!');
      }
      setUpdateSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='flex items-center space-x-4'>
      <ModalDialog
        description='Are you sure you want to delete this country?'
        handleClick={handleDeleteCountry}
      />
    </div>
  );
};

export default DeleteCountry;
