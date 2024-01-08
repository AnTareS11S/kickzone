import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const PlayerRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (currentUser && currentUser?.role === 'player') ||
    currentUser?.role === 'user' ? (
    <Outlet />
  ) : (
    <Navigate to='/' />
  );
};

export default PlayerRoute;
