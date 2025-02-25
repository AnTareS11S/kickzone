export const fetchInitialMessagesCount = async (userId) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/conversations/unread/${userId}`
  );
  if (!res.ok) throw new Error('Failed to fetch unread messages');
  const data = await res.json();
  return data;
};

export const markConversationAsRead = async (conversationId, userId) => {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/api/conversations/mark-as-read/${conversationId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    }
  );

  if (!res.ok) throw new Error('Failed to mark conversation as read');
};
