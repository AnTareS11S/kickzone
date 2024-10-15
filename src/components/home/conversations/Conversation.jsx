import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Button } from '../../ui/button';
import { useToast } from '../../ui/use-toast';
import { FiTrash2 } from 'react-icons/fi';
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

const Conversation = ({ conversation, onConversationDeleted }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [user, setUser] = useState(null);

  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(
          `/api/user/get-user-info/${currentUser?._id}?conversationId=${conversation._id}`
        );
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getUser();
  }, [conversation, currentUser]);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`/api/conversations/delete/${conversation._id}`, {
        method: 'DELETE',
      });
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
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className='flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 group'
      >
        <>
          <div className='flex items-center flex-grow mr-2'>
            <img
              src={
                user?.imageUrl ||
                'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
              }
              alt={user?.name}
              className='mr-3 w-10 h-10 rounded-full object-cover'
            />
            <div className='flex-grow min-w-0'>
              <div className='font-semibold truncate'>
                {user?.name} {user?.surname}
              </div>
            </div>
          </div>
          <div className='flex-shrink-0'>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleDeleteClick}
              className='text-gray-400 hover:text-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors duration-200 opacity-0 group-hover:opacity-100'
              aria-label='Delete conversation'
            >
              <FiTrash2 className='h-5 w-5' />
            </Button>
          </div>
        </>
      </motion.div>
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

export default Conversation;
