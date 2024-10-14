import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchUserData } from '../redux/user/userSlice';
import Spinner from '../components/Spinner';

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  const isAuthenticated = !!currentUser;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserData(currentUser._id));
    }
  }, [dispatch, isAuthenticated, currentUser]);

  if (loading) {
    return <Spinner />;
  }

  if (isAuthenticated && !currentUser.isOnboardingCompleted) {
    // If user is authenticated but hasn't completed onboarding, redirect to onboarding page
    return <Navigate to='/onboarding' />;
  }

  // If user is authenticated and has completed onboarding, render the protected route
  return <Outlet />;
};

export default ProtectedRoute;
