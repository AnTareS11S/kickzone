import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PostProtectedRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser || currentUser?.role === 'Player') {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default PostProtectedRoute;
