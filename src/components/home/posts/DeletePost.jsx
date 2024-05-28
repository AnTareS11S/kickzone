import { useLocation, useNavigate } from 'react-router-dom';
import ModalDialog from '../../ModalDialog';

const DeletePost = ({
  postId,
  currentUserId,
  authorId,
  parentId,
  isComment,
  setDeleteSuccess,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (currentUserId !== authorId || pathname === '/') return null;

  const handleDeletePost = async () => {
    try {
      const res = await fetch('/api/post/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: postId }),
      });
      if (!res.ok) {
        throw new Error('Failed to fetch data!');
      }
      setDeleteSuccess(true);
      if (!parentId || !isComment) navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalDialog
      description='Are you sure you want to delete this post?'
      handleClick={() => handleDeletePost() && setDeleteSuccess(false)}
    />
  );
};

export default DeletePost;
