import { useCallback, useEffect, useState } from 'react';
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
  const [isRead, setIsRead] = useState(false);
  const { emit, socket, subscribe } = useSocket();

  const getNotifications = useCallback(async () => {
    if (!currentUser?._id) return;

    try {
      const res = await fetch(`/api/notifications/details/${currentUser._id}`);
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();
      setNotifications(data.notifications);
      setIsDeleted(false);
      setIsRead(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications, isDeleted, isRead]);

  const handleRemoveNotification = useCallback(async (data) => {
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
      const res = await fetch(`/api/notifications/delete/${data.authorId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: data.userId,
          postId: data.postId,
          type: data.type,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to delete notification from database');
      }
      setIsDeleted(true);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    const getNotificationHandler = async (notification) => {
      const existingNotification = notifications.find(
        (n) =>
          n.senderId?._id === notification.senderId &&
          n.postId === notification.postId &&
          n.type === notification.type
      );

      if (existingNotification) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === existingNotification._id ? { ...n, isRead: false } : n
          )
        );
        return;
      }

      try {
        const res = await fetch(
          `/api/notifications/details/${currentUser._id}`
        );
        if (!res.ok) throw new Error('Failed to fetch notifications');
        const data = await res.json();
        const newNotification = data.notifications.find(
          (n) =>
            n.senderId?._id === notification.senderId &&
            n.postId === notification.postId &&
            n.type === notification.type
        );

        if (newNotification) {
          setNotifications((prev) => [
            {
              _id: newNotification._id,
              senderId: {
                _id: newNotification.senderId._id,
                username: newNotification.senderId.username,
                imageUrl: newNotification.senderId.imageUrl,
              },
              type: newNotification.type,
              postId: newNotification.postId,
              createdAt: newNotification.createdAt,
              isRead: false,
            },
            ...prev,
          ]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const unsubscribeGet = subscribe('getNotification', getNotificationHandler);
    const unsubscribeRemove = subscribe(
      'removeNotification',
      handleRemoveNotification
    );

    return () => {
      unsubscribeGet();
      unsubscribeRemove();
    };
  }, [
    socket,
    subscribe,
    handleRemoveNotification,
    currentUser?._id,
    notifications,
  ]);

  const handleMarkAsRead = useCallback(
    async (notificationId) => {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );

      const notification = notifications.find((n) => n._id === notificationId);

      if (!notification) return;

      try {
        const res = await fetch(
          `/api/notifications/mark-as-read/${currentUser?._id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              notificationId,
            }),
          }
        );

        if (!res.ok) {
          throw new Error('Failed to mark notification as read');
        }

        const unreadCountRes = await fetch(
          `/api/notifications/unread-count/${currentUser?._id}`
        );
        if (!unreadCountRes.ok) {
          throw new Error('Failed to fetch unread count');
        }
        const unreadCountData = await unreadCountRes.json();

        emit('updateUnreadNotificationCount', {
          userId: currentUser?._id,
          count: unreadCountData.unreadCount,
        });

        emit('newUnreadNotification', {
          userId: currentUser?._id,
          authorId: notification.senderId?._id,
          postId: notification.postId,
          type: notification.type,
          action: 'read',
          notificationId,
        });
      } catch (error) {
        console.error('Error marking notification as read:', error);
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif._id === notificationId ? { ...notif, isRead: false } : notif
          )
        );
      }
    },
    [notifications, emit, currentUser?._id]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) => ({ ...notif, isRead: true }))
    );

    try {
      const res = await fetch(
        `/api/notifications/mark-all-as-read/${currentUser._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUser?._id,
          }),
        }
      );

      if (!res.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      emit('updateUnreadNotificationCount', {
        userId: currentUser?._id,
        count: 0,
      });

      notifications.forEach((notification) => {
        if (!notification.isRead) {
          emit('newUnreadNotification', {
            userId: currentUser?._id,
            authorId: notification.senderId?._id,
            postId: notification.postId,
            type: notification.type,
            action: 'read',
            notificationId: notification._id,
          });
        }
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // W przypadku błędu, przywracamy poprzedni stan
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, isRead: false }))
      );
    }
  }, [notifications, emit, currentUser?._id]);

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
