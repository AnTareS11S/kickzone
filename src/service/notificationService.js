export const fetchNotifications = async (userId) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/notifications/details/${userId}`
  );
  if (!res.ok) throw new Error('Failed to fetch notifications');
  const data = await res.json();
  return data;
};

export const deleteNotification = async (authorId, userId, postId, type) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/notifications/delete/${authorId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId: userId,
        postId,
        type,
      }),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to delete notification from database');
  }
};

export const markAsRead = async (userId, notificationId) => {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/api/notifications/mark-as-read/${userId}`,
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
};

export const markAllAsRead = async (userId) => {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/api/notifications/mark-all-as-read/${userId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to mark all notifications as read');
  }
};

export const fetchUnreadCount = async (userId) => {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/api/notifications/unread-count/${userId}`
  );
  if (!res.ok) throw new Error('Failed to fetch unread count');
  return await res.json();
};
