import { useState } from 'react';
import ModalActions from '../../ModalActions';
import { useToast } from '../../ui/use-toast';
import { useForm } from 'react-hook-form';
import { useOnSuccessUpdate } from '../../hooks/useOnSuccessUpdate';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const MessageSchema = z.object({
  message: z.string().min(1, { message: 'Message is required' }),
});

const SendMessage = ({ row, onEntityUpdated }) => {
  const { toast } = useToast();
  const [updatedSuccess, setUpdatedSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      message: '',
    },
    mode: 'onChange',
  });

  useOnSuccessUpdate(updatedSuccess, () => {
    onEntityUpdated();
    setUpdatedSuccess(false);
  });

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/admin/users/notification/${row?._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Message sent successfully',
        });
        setUpdatedSuccess(true);
        setIsModalOpen(false);
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to send message',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ModalActions
        title='Message'
        desc='Send a message to the user'
        onSubmit={onSubmit}
        data={row}
        isMessage
        fields={[
          {
            id: 'message',
            type: 'textarea',
            name: 'message',
            placeholder: 'Enter message',
          },
        ]}
        form={form}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOpen={() => setIsModalOpen(true)}
      />
    </>
  );
};

export default SendMessage;
