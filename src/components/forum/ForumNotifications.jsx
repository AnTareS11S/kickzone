import { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { Badge } from '../ui/badge';
import { TbMessageCircle } from 'react-icons/tb';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useSocket } from '../../hook/useSocket';
import { Link } from 'react-router-dom';

const ForumNotifications = ({ userId, role }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [teamId, setTeamId] = useState('');
  const { subscribe, emit, isConnected, unsubscribe } = useSocket();

  useEffect(() => {
    const getTeamForumNotifications = async () => {
      try {
        const res = await fetch(`/api/forum/notifications/${userId}/${role}`);
        const data = await res.json();
        setNotifications(data.notifications);
        setTeamId(data.teamId);
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.log(error);
      }
    };

    getTeamForumNotifications();
  }, [userId, role]);

  useEffect(() => {
    if (!userId || !isConnected) return;

    subscribe('teamForumNotificationsStatus', (data) => {
      setUnreadCount(data.unreadCount);
    });

    subscribe('teamForumNotificationDetails', (data) => {
      setNotifications((prevNotifications) => {
        const exists = prevNotifications.some(
          (notification) => notification._id === data.notification._id
        );

        if (exists) {
          return prevNotifications.map((notification) =>
            notification._id === data.notification._id
              ? data.notification
              : notification
          );
        } else {
          return [data.notification, ...prevNotifications];
        }
      });
    });

    subscribe('teamForumNotificationStatusAfterUpdate', (data) => {
      setUnreadCount(data.unreadCount);
    });

    subscribe('teamForumNotificationStatusAfterDeletion', (data) => {
      setUnreadCount(data.unreadCount);
    });

    return () => {
      unsubscribe('teamForumNotificationsStatus');
      unsubscribe('teamForumNotificationDetails');
      unsubscribe('teamForumNotificationStatusAfterUpdate');
      unsubscribe('teamForumNotificationStatusAfterDeletion');
    };
  }, [subscribe, userId, isConnected, unsubscribe]);

  const handleMarkAsRead = (notificationId) => {
    emit('markTeamForumNotificationRead', {
      teamId,
      userId,
      notificationId,
    });

    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification._id !== notificationId
      )
    );
  };

  return (
    <Popover>
      <PopoverTrigger className='relative'>
        <FaBell className='w-6 h-6' />
        {unreadCount > 0 && (
          <Badge
            variant='destructive'
            className='absolute -top-2 -right-2 px-1.5 py-0.5 text-xs'
          >
            {unreadCount}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='space-y-2'>
          <h4 className='font-semibold text-lg flex items-center'>
            <TbMessageCircle className='mr-2' /> Forum Notifications
          </h4>
          {notifications?.length === 0 ? (
            <p className='text-gray-500 text-sm'>No new notifications</p>
          ) : (
            notifications?.map((notification) => (
              <div
                key={notification._id}
                className='border-b pb-2 last:border-b-0'
              >
                <div className='flex justify-between items-start'>
                  <Link to={`/forum/${notification?.threadId}`}>
                    <p className='text-sm font-medium'>
                      {notification?.type === 'newThread'
                        ? 'New Thread Created'
                        : 'New Comment'}
                    </p>
                    <p className='text-xs text-gray-600'>
                      {notification.title || notification.content}
                    </p>
                  </Link>
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className='text-xs text-gray-500 hover:text-gray-800'
                  >
                    Mark Read
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ForumNotifications;
