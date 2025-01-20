import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useThreadActions = (threadId) => {
  const navigate = useNavigate();
  const [thread, setThread] = useState();
  const [isLiking, setIsLiking] = useState(false);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [isLikingComment, setIsLikingComment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchThread = useCallback(async () => {
    try {
      const res = await fetch(`/api/forum/thread/${threadId}`);
      const data = await res.json();
      setThread(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Error fetching thread:', error);
    } finally {
      setIsLoading(false);
    }
  }, [threadId]);

  const likeThread = async (userId, role) => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      const res = await fetch(`/api/forum/thread/${threadId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      });
      if (res.ok) {
        await fetchThread();
      }
    } catch (error) {
      console.error('Error liking thread:', error);
    } finally {
      setTimeout(() => setIsLiking(false), 500);
    }
  };

  const handleComment = async (e, userId, role) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/forum/thread/${threadId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: comment,
          userId,
          model: role,
        }),
      });
      if (res.ok) {
        setComment('');
        await fetchThread();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEdit = async (e) => {
    e?.preventDefault();
    try {
      const res = await fetch(`/api/forum/thread/edit/${threadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        setIsEditing(false);
        await fetchThread();
      }
    } catch (error) {
      console.error('Error updating thread:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/forum/thread/delete/${threadId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        navigate(-1);
      }
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };

  const handleCommentEdit = async (commentId, content) => {
    try {
      const res = await fetch(`/api/forum/comment/edit/${commentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setEditingCommentId(null);
        setEditingCommentContent('');
        await fetchThread();
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    console.log(commentId);
    try {
      const res = await fetch(`/api/forum/comment/delete/${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchThread();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleCommentLike = async (commentId, userId, role) => {
    if (isLikingComment) return;
    try {
      setIsLikingComment(true);
      const res = await fetch(`/api/forum/comment/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      });
      if (res.ok) {
        await fetchThread();
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    } finally {
      setTimeout(() => setIsLikingComment(false), 500);
    }
  };

  return {
    thread,
    likeThread,
    fetchThread,
    isLiking,
    comment,
    setComment,
    isEditing,
    setIsEditing,
    editData,
    setEditData,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    editingCommentId,
    setEditingCommentId,
    editingCommentContent,
    setEditingCommentContent,
    isLikingComment,
    isLoading,
    handleComment,
    handleCommentEdit,
    handleCommentDelete,
    handleEdit,
    handleDelete,
    handleCommentLike,
  };
};
