import { useNavigate } from 'react-router-dom';
import ModalDialog from '../../ModalDialog';
import { useToast } from '../../ui/use-toast';
import { io } from 'socket.io-client';
import { useEffect, useRef } from 'react';

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
  const socket = useRef();

  useEffect(() => {
    socket.current = io('ws://localhost:3000');

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleDeletePost = async () => {
    try {
      const res = await fetch('/api/post/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: postId }),
      });
      if (res.ok) {
        socket.current.emit('newUnreadNotification', {
          postId,
          userId,
          isComment: true,
          authorId,
          isDelete: true,
        });

        toast({
          title: 'Success!',
          description: 'Post deleted successfully',
        });

        setDeleteSuccess(true);
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to delete post',
          variant: 'destructive',
        });
      }
      if (!parentId || !isComment) navigate('/');
    } catch (error) {
      console.log(error);
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
    />
  );
};

export default DeletePost;
