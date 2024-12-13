import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCheckCircle, FaSignOutAlt } from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { signOutUserSuccess } from '../../redux/user/userSlice';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';

const RoleNotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/user/get-role-change-notifications/${currentUser._id}`
        );
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUser._id]);

  const handleLogout = async () => {
    try {
      const res = await fetch(
        '/api/user/mark-role-change-notification-as-read',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser?._id }),
        }
      );

      if (!res.ok) {
        throw new Error('Failed to mark notifications as read');
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
    dispatch(signOutUserSuccess());
    navigate('/sign-in');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8'>
      <div className='max-w-4xl mx-auto space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
              Role Change Notifications
            </h1>
            <p className='mt-1 text-sm text-gray-500'>
              Recent changes to your account role
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' className='flex items-center gap-2'>
                <FaSignOutAlt className='h-4 w-4' />
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to logout?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You will be redirected to the login page and your current
                  session will end.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className='bg-red-500 hover:bg-red-600'
                >
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900'></div>
          </div>
        ) : notifications.length === 0 ? (
          <Card className='text-center py-12 bg-white shadow-md'>
            <CardContent>
              <FaBell className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900'>
                No role change notifications
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                No recent changes to your account role.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {notifications.map((notification) => (
              <Card
                key={notification._id}
                className={`hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${
                  !notification.isRead ? 'border-2 border-primary-500' : ''
                }`}
              >
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-lg'>
                    <FaCheckCircle className='h-5 w-5 text-green-500' />
                    Role Changed to{' '}
                    {notification.role.charAt(0).toUpperCase() +
                      notification.role.slice(1)}
                  </CardTitle>
                  <CardDescription className='text-sm text-gray-500'>
                    {new Date(notification.createdAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-600'>{notification.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleNotificationPage;
