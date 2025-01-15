import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const AdminRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.role === 'Admin' ? (
    <Outlet />
  ) : (
    <Navigate to='/' />
  );
};

export default AdminRoute;
