import { useState } from 'react';
import { useOnSuccessUpdate } from './hooks/useOnSuccessUpdate';
import ModalDialog from './ModalDialog';
import { useToast } from './ui/use-toast';
import { useSocket } from '../hook/useSocket';

const DeleteEntity = ({ row, onEntityDelete, apiEndpoint }) => {
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { emit } = useSocket();

  useOnSuccessUpdate(updateSuccess, () => {
    onEntityDelete();
    setUpdateSuccess(false);
  });

  const handleDeleteEntity = async () => {
    setIsDeleting(true);
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

        if (apiEndpoint === 'training') {
          emit('removeTeamTraining', {
            teamId: row.teamId,
          });
        }
      } else {
        toast({
          title: 'Error!',
          description: `Failed to delete ${row?.name}`,
          variant: 'destructive',
        });
        setIsDeleting(false);
      }
      setUpdateSuccess(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='flex items-center space-x-4'>
      <ModalDialog
        description={`Are you sure you want to delete this ${
          apiEndpoint?.split('/')[0]
        }?`}
        handleClick={handleDeleteEntity}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default DeleteEntity;
