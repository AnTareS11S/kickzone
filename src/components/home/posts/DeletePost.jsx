import { useLocation, useNavigate } from 'react-router-dom';
import ModalDialog from '../../ModalDialog';
import { useToast } from '../../ui/use-toast';

const DeletePost = ({ postId, parentId, isComment, setDeleteSuccess }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
