import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCheckCircle, FaSignOutAlt, FaTrash } from 'react-icons/fa';
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
import Spinner from '../../components/Spinner';
import { TbLoader2 } from 'react-icons/tb';

const RoleNotificationPage = () => {
  const [roleNotifications, setRoleNotifications] = useState([]);
  const [contentDeletedNotifications, setContentDeletedNotifications] =
    useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const [roleResponse, contentResponse] = await Promise.all([
          fetch(
            `${
              import.meta.env.VITE_API_BASE_URL
            }/api/user/get-role-change-notifications/${currentUser._id}`
          ),
          fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/user/get-content-notif/${
              currentUser._id
            }`
          ),
        ]);

        const roleData = await roleResponse.json();
        const contentData = await contentResponse.json();

        setRoleNotifications(roleData);
        setContentDeletedNotifications(contentData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUser._id]);

  const handleMarkContentAsRead = async (notificationId) => {
    try {
      setUpdating(true);
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/user/mark-content-notification-as-read`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser?._id,
            notificationId,
          }),
        }
      );

      if (res.ok) {
        // Remove the notification and navigate to home
        setContentDeletedNotifications((prev) =>
          prev.filter((notif) => notif._id !== notificationId)
        );
        navigate('/');
      } else {
        throw new Error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking content notification as read:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/user/mark-role-change-notification-as-read`,
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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className='min-h-screen p-4 sm:p-6 lg:p-8'>
      <div className='max-w-8xl mx-auto space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
              Notifications
            </h1>
            <p className='mt-1 text-sm text-gray-500'>
              Recent account changes and content notifications
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

        <div className='space-y-6'>
          {/* Role Change Notifications Section */}
          <div>
            <h2 className='text-xl font-semibold mb-4'>
              Role Change Notifications
            </h2>
            {roleNotifications.length === 0 ? (
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
                {roleNotifications.map((notification) => (
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

          {/* Content Deleted Notifications Section */}
          <div>
            <h2 className='text-xl font-semibold mb-4'>
              Content Deleted Notifications
            </h2>
            {contentDeletedNotifications.length === 0 ? (
              <Card className='text-center py-12 bg-white shadow-md'>
                <CardContent>
                  <FaBell className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg font-medium text-gray-900'>
                    No content deleted notifications
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    No recent content deletions.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {contentDeletedNotifications.map((notification) => (
                  <Card
                    key={notification._id}
                    className={`hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${
                      !notification.isRead ? 'border-2 border-primary-500' : ''
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2 text-lg'>
                        <FaTrash className='h-5 w-5 text-red-500' />
                        Content Deleted
                      </CardTitle>
                      <CardDescription className='text-sm text-gray-500'>
                        {new Date(notification.createdAt).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className='text-gray-600 mb-4'>
                        {notification.contentType} removed due to{' '}
                        {notification.reason.replace(/_/g, ' ')}
                      </p>
                      {notification.description && (
                        <p className='text-sm text-gray-500 italic'>
                          `&quot;`{notification.description}`&quot;`
                        </p>
                      )}
                      <Button
                        onClick={() =>
                          handleMarkContentAsRead(notification._id)
                        }
                        className='mt-4 w-full bg-primary-500 hover:bg-purple-500'
                        disabled={updating}
                      >
                        {updating ? (
                          <>
                            <TbLoader2 className='mr-2 h-4 w-4 animate-spin' />
                            <span>Marking as Read...</span>
                          </>
                        ) : (
                          <span>Mark as Read and Go Home</span>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleNotificationPage;
