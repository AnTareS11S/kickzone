import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const CoachRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.role === 'Coach' ? (
    <Outlet />
  ) : (
    <Navigate to='/' />
  );
};

export default CoachRoute;
