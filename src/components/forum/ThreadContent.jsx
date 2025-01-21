import { FaEdit, FaThumbsUp, FaTrash } from 'react-icons/fa';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { getTimeAgo } from '../../lib/utils';
import { Avatar, AvatarImage } from '../ui/avatar';
import { CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';

export const ThreadContent = ({
  thread,
  isEditing,
  editData,
  isLiking,
  currentUserId,
  onEditChange,
  onEditSubmit,
  onEditCancel,
  onEditToggle,
  onDeleteClick,
  onLike,
}) => {
  return (
    <>
      <CardHeader>
        <div className='flex justify-between items-start p-4'>
          {isEditing ? (
            <Input
              value={editData.title}
              onChange={(e) =>
                onEditChange({ ...editData, title: e.target.value })
              }
              className='text-heading4-medium '
            />
          ) : (
            <CardTitle className='text-heading4-medium '>
              {thread.title}
            </CardTitle>
          )}

          {currentUserId === thread?.user && (
            <div className='flex gap-2'>
              <Button variant='ghost' size='sm' onClick={onEditToggle}>
                <FaEdit className='h-4 w-4 text-primary-500' />
              </Button>
              <Button variant='ghost' size='sm' onClick={onDeleteClick}>
                <FaTrash className='h-4 w-4 text-red-500' />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <div className='space-y-4 px-10'>
        <div className='flex items-center gap-4'>
          <Avatar className='h-10 w-10'>
            <AvatarImage
              src={
                thread.author?.avatar ||
                'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
              }
              alt={thread.author?.name}
            />
          </Avatar>
          <div>
            <p className='font-medium'>{thread.author?.name}</p>
            <p className='text-sm text-gray-500'>
              {getTimeAgo(thread?.createdAt)}
            </p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={onEditSubmit} className='space-y-4'>
            <Textarea
              value={editData.content}
              onChange={(e) =>
                onEditChange({ ...editData, content: e.target.value })
              }
              className='min-h-[200px] '
            />
            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={onEditCancel}>
                Cancel
              </Button>
              <Button
                type='submit'
                className='bg-primary-500 hover:bg-purple-500'
              >
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <>
            <p className='text-gray-700'>{thread.content}</p>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                size='sm'
                onClick={onLike}
                disabled={isLiking}
                className={`flex items-center gap-2 ${
                  thread.likes.includes() ? 'text-primary-500' : ''
                }`}
              >
                <FaThumbsUp className='h-4 w-4' />
                {thread.likesCount}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ThreadContent;
