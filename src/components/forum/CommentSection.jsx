import { useState } from 'react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { getTimeAgo } from '../../lib/utils';
import { FaEdit, FaThumbsUp, FaTrash } from 'react-icons/fa';
import { DeleteDialog } from './DeleteDialog';

export const CommentSection = ({
  thread,
  comment,
  currentUserId,
  editingCommentId,
  editingCommentContent,
  isLikingComment,
  onCommentChange,
  onCommentSubmit,
  onCommentEditStart,
  onCommentEditChange,
  onCommentEditSubmit,
  onCommentDelete,
  onCommentLike,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (commentToDelete) {
      onCommentDelete(commentToDelete);
      setIsDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };
  return (
    <>
      <div className='mt-8 space-y-4 p-4'>
        <h3 className='font-semibold'>Comments ({thread.repliesCount})</h3>

        <form onSubmit={onCommentSubmit} className='space-y-4'>
          <Textarea
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder='Write a comment...'
            className='min-h-[100px]'
          />
          <div className='flex justify-end'>
            <Button
              type='submit'
              className='bg-primary-500 hover:bg-purple-500'
            >
              Add Comment
            </Button>
          </div>
        </form>

        <div className='space-y-4'>
          {thread.replies?.map((reply) => (
            <Card key={reply._id}>
              <CardContent className='p-4'>
                <div className='flex items-start gap-4'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage
                      src={reply.author?.avatar || '/default-avatar.png'}
                      alt={reply.author?.name}
                    />
                  </Avatar>
                  <div className='flex-1'>
                    <div className='flex justify-between items-center'>
                      <p className='font-medium'>{reply.author?.name}</p>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm text-gray-500'>
                          {getTimeAgo(reply.createdAt)}
                        </p>
                        {currentUserId === reply.user && (
                          <div className='flex gap-2'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                onCommentEditStart(reply._id, reply.content)
                              }
                            >
                              <FaEdit className='h-3 w-3 text-primary-500' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleDeleteClick(reply._id)}
                            >
                              <FaTrash className='h-3 w-3 text-red-500' />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    {editingCommentId === reply._id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          onCommentEditSubmit(reply._id);
                        }}
                        className='mt-2'
                      >
                        <Textarea
                          value={editingCommentContent}
                          onChange={(e) => onCommentEditChange(e.target.value)}
                          className='min-h-[80px] mb-2'
                        />
                        <div className='flex justify-end gap-2'>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => onCommentEditStart(null, '')}
                          >
                            Cancel
                          </Button>
                          <Button type='submit' size='sm'>
                            Save
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <p className='text-gray-700 mt-2'>{reply.content}</p>
                        <div className='flex items-center gap-4 mt-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => onCommentLike(reply._id)}
                            disabled={isLikingComment}
                            className={`flex items-center gap-2 ${
                              reply.likes?.includes(currentUserId)
                                ? 'text-primary-500'
                                : ''
                            }`}
                          >
                            <FaThumbsUp className='h-3 w-3' />
                            {reply.likesCount || 0}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <DeleteDialog
        title='Delete Comment'
        description='Are you sure you want to delete this comment? This action cannot be undone.'
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default CommentSection;
