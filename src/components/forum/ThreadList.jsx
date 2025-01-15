import { PinTopIcon } from '@radix-ui/react-icons';
import { BiMessageSquare } from 'react-icons/bi';
import { FaThumbsUp, FaClock } from 'react-icons/fa';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarImage } from '../ui/avatar';
import { getTimeAgo } from '../../lib/utils';
import { Link } from 'react-router-dom';

const ThreadList = ({ threads }) => {
  return (
    <div className='lg:col-span-3 space-y-4'>
      {threads?.map((thread) => (
        <Card key={thread?._id} className='hover:shadow-md transition-shadow'>
          <Link to={`/forum/${thread?._id}`}>
            <CardContent className='p-6 '>
              <div className='flex items-start gap-4 '>
                <Avatar className='h-10 w-10'>
                  <AvatarImage
                    src={
                      thread.author?.avatar ||
                      'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
                    }
                    alt={thread.author?.name}
                  />
                </Avatar>
                <div className='flex-1 min-w-0 '>
                  <div className='flex items-center gap-2 mb-1'>
                    {thread?.isPinned && (
                      <PinTopIcon className='h-4 w-4 text-primary-500' />
                    )}
                    <h3 className='font-semibold text-gray-900 truncate'>
                      {thread?.title}
                    </h3>
                  </div>

                  <p className='text-sm text-gray-500 mb-3'>
                    {thread?.preview}
                  </p>

                  <div className='flex items-center gap-4 text-sm text-gray-500 '>
                    <span className='font-medium'>{thread.author?.name}</span>
                    <div className='flex items-center gap-1'>
                      <BiMessageSquare className='h-4 w-4' />
                      {thread?.repliesCount}
                    </div>
                    <div className='flex items-center gap-1'>
                      <FaThumbsUp className='h-4 w-4' />
                      {thread?.likesCount}
                    </div>
                    <div className='flex items-center gap-1'>
                      <FaClock className='h-4 w-4' />
                      {getTimeAgo(thread?.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default ThreadList;
