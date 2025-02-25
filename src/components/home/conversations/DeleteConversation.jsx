import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog';
import { useToast } from '../../ui/use-toast';
import { FiTrash2 } from 'react-icons/fi';
import { Button } from '../../ui/button';

const DeleteConversation = ({
  conversation,
  userId,
  onConversationDeleted,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { toast } = useToast();

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/conversations/delete/${
          conversation._id
        }`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      );
      if (!res.ok) throw new Error('Failed to delete conversation');
      toast({
        title: 'Success',
        description: 'Conversation deleted successfully',
      });
      onConversationDeleted(conversation._id);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete conversation',
        variant: 'destructive',
      });
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className='flex-shrink-0 '>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleDeleteClick}
          className='text-gray-400 hover:text-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors duration-200'
        >
          <FiTrash2 className='h-5 w-5 ' />
        </Button>
      </div>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className='bg-red-500 hover:bg-red-600'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteConversation;
