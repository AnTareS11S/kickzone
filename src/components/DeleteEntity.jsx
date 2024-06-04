import { useState } from 'react';
import { useOnSuccessUpdate } from './hooks/useOnSuccessUpdate';
import ModalDialog from './ModalDialog';
import { useToast } from './ui/use-toast';

const DeleteEntity = ({ row, onEntityDelete, apiEndpoint }) => {
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { toast } = useToast();

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
      if (res.ok) {
        toast({
          title: 'Success!',
          description: `${row?.name} deleted successfully`,
        });
      } else {
        toast({
          title: 'Error!',
          description: `Failed to delete ${row?.name}`,
          variant: 'destructive',
        });
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
