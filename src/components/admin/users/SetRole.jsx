import { useForm } from 'react-hook-form';
import ModalActions from '../../ModalActions';
import { useToast } from '../../ui/use-toast';
import { useState } from 'react';
import { useOnSuccessUpdate } from '../../../hook/useOnSuccessUpdate';

const SetRole = ({ row, onEntityUpdated }) => {
  const { toast } = useToast();
  const [updatedSuccess, setUpdatedSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      role: '',
    },
  });

  useOnSuccessUpdate(updatedSuccess, () => {
    onEntityUpdated();
    setUpdatedSuccess(false);
  });

  const roles = ['User:1', 'Admin:2', 'Coach:3', 'Referee:4', 'Player:5'];

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/admin/users/${row?._id}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'User role updated successfully',
        });
        setUpdatedSuccess(true);
        setIsModalOpen(false);
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update user role',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ModalActions
      label='Change Role'
      title='Change Role'
      onSubmit={onSubmit}
      data={row}
      isRole
      fields={[
        {
          id: 'role',
          label: 'Role',
          type: 'select',
          name: 'role',
          items: roles,
          placeholder: 'Select a role',
          defaultValue: row?.role,
        },
      ]}
      form={form}
      edit
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onOpen={() => setIsModalOpen(true)}
    />
  );
};

export default SetRole;
