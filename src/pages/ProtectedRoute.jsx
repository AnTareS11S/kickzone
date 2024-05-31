import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  const isAuthenticated = !!currentUser;

  return isAuthenticated && currentUser.isOnboardingCompleted ? (
    <Navigate to='/onboarding' />
  ) : (
    <Outlet />
  );
};

export default ProtectedRoute;
