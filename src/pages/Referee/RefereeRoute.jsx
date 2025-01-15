import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const ReferreRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser?.role === 'Referee' ? (
    <Outlet />
  ) : (
    <Navigate to='/' />
  );
};

export default ReferreRoute;
