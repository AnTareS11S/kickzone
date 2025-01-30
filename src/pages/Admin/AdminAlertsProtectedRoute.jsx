import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminAlertsProtectedRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser || currentUser?.isRoleChangeNotificationRead) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default AdminAlertsProtectedRoute;
