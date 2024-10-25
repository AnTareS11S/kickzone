import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../../components/Spinner';
import { Button } from '../../components/ui/button';
import { FaBell } from 'react-icons/fa';
import NotificationItem from '../../components/home/notifications/NotificationItem';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { useSocket } from '../../hook/useSocket';

const Notification = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const { socket, subscribe } = useSocket();

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await fetch(
          `/api/notifications/details/${currentUser?._id}`
        );
        if (!res.ok) throw new Error('Failed to fetch notifications');
        const data = await res.json();
        setNotifications(data.notifications);
        setIsDeleted(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?._id) getNotifications();
  }, [currentUser, isDeleted]);

  useEffect(() => {
    if (socket) {
      subscribe('getNotification', (notification) => {
        setNotifications((prev) => {
          const exists = prev.some(
            (n) =>
              n.senderId?._id === notification.userId &&
              n.postId === notification.postId &&
              n.type === notification.type
          );

          if (exists) return prev;

          return [
            {
              _id: Date.now(),
              senderId: {
                _id: notification.userId,
                username: notification.username,
                imageUrl: notification.userImg,
              },
              type: notification.type,
              postId: notification.postId,
              createdAt: notification.createdAt,
              isRead: false,
            },
            ...prev,
          ];
        });
      });

      subscribe('removeNotification', async (data) => {
        setNotifications((prev) =>
          prev.filter(
            (n) =>
              !(
                n.senderId?._id === data.userId &&
                n.postId === data.postId &&
                n.type === data.type
              )
          )
        );

        try {
          const res = await fetch(
            `/api/notifications/delete/${data.authorId}`,
            {
              method: 'DELETE',

              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                senderId: data.userId,
                postId: data.postId,
                type: data.type,
              }),
            }
          );

          if (!res.ok) {
            throw new Error('Failed to delete notification from database');
          }
          setIsDeleted(true);
        } catch (error) {
          console.error('Error deleting notification:', error);
        }
      });
    }
  }, [socket, subscribe, currentUser]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const res = await fetch(
        `/api/notifications/mark-as-read/${currentUser._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notificationId }),
        }
      );
      if (!res.ok) throw new Error('Failed to mark as read');

      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {};

  if (loading) return <Spinner />;

  return (
    <div className='max-w-7xl mx-auto px-4'>
      <Card className='bg-white dark:bg-gray-800 shadow-xl'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-2xl font-semibold text-gray-800 dark:text-gray-200'>
            Notifications
          </CardTitle>
          {notifications?.length > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant='outline'
              className='text-sm hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              Mark all as read
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <AnimatePresence>
              {notifications?.length > 0 ? (
                notifications.map((item) => (
                  <NotificationItem
                    key={item._id}
                    item={item}
                    onRead={handleMarkAsRead}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='text-center py-8'
                >
                  <FaBell className='w-12 h-12 mx-auto text-gray-400 mb-3' />
                  <p className='text-gray-600 dark:text-gray-400'>
                    No new notifications
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notification;
