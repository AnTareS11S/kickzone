import { useLocation, useNavigate } from 'react-router-dom';

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
    <img
      src='/delete.svg'
      alt='delete'
      width={18}
      height={18}
      className='cursor-pointer object-contain'
      onClick={handleDeletePost}
    />
  );
};

export default DeletePost;
