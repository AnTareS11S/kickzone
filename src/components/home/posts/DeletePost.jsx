import { useNavigate } from 'react-router-dom';
import ModalDialog from '../../ModalDialog';
import { useToast } from '../../ui/use-toast';
import { useSocket } from '../../../hook/useSocket';
import { useState } from 'react';

const DeletePost = ({
  postId,
  parentId,
  isComment,
  setDeleteSuccess,
  authorId,
  userId,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { emit } = useSocket();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/post/delete/${postId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (res.ok) {
        emit('newUnreadNotification', {
          userId,
          authorId,
          postId,
          type: 'comment',
          action: 'delete',
        });

        toast({
          title: 'Success!',
          description: 'Post deleted successfully',
        });

        setDeleteSuccess(true);

        if (!parentId || !isComment) {
          setTimeout(() => {
            navigate('/');
          }, 500);
        }
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to delete post',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
      setIsDeleting(false);
    }
  };

  return (
    <ModalDialog
      description='Are you sure you want to delete this post?'
      type='button'
      title='Delete Post'
      handleClick={() => {
        handleDeletePost();
        setDeleteSuccess(false);
      }}
      isDeleting={isDeleting}
    />
  );
};

export default DeletePost;
