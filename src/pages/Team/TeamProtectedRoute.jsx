import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const TeamProtectedRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (
    !currentUser ||
    (currentUser?.role !== 'Player' && currentUser?.role !== 'Coach')
  ) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default TeamProtectedRoute;
