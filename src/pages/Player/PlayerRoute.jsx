import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const PlayerRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (currentUser && currentUser?.role === 'Player') ||
    currentUser?.role === 'User' ? (
    <Outlet />
  ) : (
    <Navigate to='/' />
  );
};

export default PlayerRoute;
