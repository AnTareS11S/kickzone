import { useEffect } from 'react';
import BackButton from '../../components/BackButton';
import { CommentSection } from '../../components/forum/CommentSection';
import { Card, CardContent } from '../../components/ui/card';
import { useThreadActions } from '../../hook/useThreadActions';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ThreadContent from '../../components/forum/ThreadContent';
import { DeleteDialog } from '../../components/forum/DeleteDialog';
import Spinner from '../../components/Spinner';

const ThreadDetails = () => {
  const threadId = useParams().id;
  const { currentUser } = useSelector((state) => state.user);
  const {
    thread,
    isLiking,
    fetchThread,
    likeThread,
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
    handleCommentLike,
    handleEdit,
    handleDelete,
  } = useThreadActions(threadId);

  useEffect(() => {
    fetchThread().then((data) => {
      if (data) {
        setEditData({ title: data.title, content: data.content });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId, fetchThread]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className='max-w-8xl mx-auto p-6'>
      <BackButton />
      <Card>
        <ThreadContent
          thread={thread}
          isEditing={isEditing}
          editData={editData}
          isLiking={isLiking}
          currentUserId={currentUser?._id}
          onEditChange={setEditData}
          onEditSubmit={handleEdit}
          onEditCancel={() => setIsEditing(false)}
          onEditToggle={() => setIsEditing(!isEditing)}
          onDeleteClick={() => setIsDeleteDialogOpen(true)}
          onLike={() => likeThread(currentUser?._id, currentUser?.role)}
        />

        <CardContent className='space-y-4'>
          <CommentSection
            thread={thread}
            comment={comment}
            currentUserId={currentUser?._id}
            editingCommentId={editingCommentId}
            editingCommentContent={editingCommentContent}
            isLikingComment={isLikingComment}
            onCommentChange={setComment}
            onCommentSubmit={(e) =>
              handleComment(e, currentUser?._id, currentUser?.role)
            }
            onCommentEditStart={(commentId, content) => {
              setEditingCommentId(commentId);
              setEditingCommentContent(content);
            }}
            onCommentEditChange={setEditingCommentContent}
            onCommentEditSubmit={(commentId) =>
              handleCommentEdit(commentId, editingCommentContent)
            }
            onCommentDelete={handleCommentDelete}
            onCommentLike={(commentId) =>
              handleCommentLike(commentId, currentUser?._id, currentUser?.role)
            }
          />
        </CardContent>
      </Card>

      <DeleteDialog
        title='Delete Thread'
        description='Are you sure you want to delete this thread? This action cannot be
          undone.'
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ThreadDetails;
