import { useState } from 'react';
import { PinTopIcon } from '@radix-ui/react-icons';
import { BiMessageSquare } from 'react-icons/bi';
import { FaThumbsUp, FaClock } from 'react-icons/fa';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarImage } from '../ui/avatar';
import { getTimeAgo } from '../../lib/utils';
import { Link } from 'react-router-dom';

const ThreadList = ({ threads }) => {
  const threadsPerPage = 5; // Number of threads per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(threads?.length / threadsPerPage);

  // Get threads for the current page
  const currentThreads = threads?.slice(
    (currentPage - 1) * threadsPerPage,
    currentPage * threadsPerPage
  );

  // Handle page change
  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className='lg:col-span-3 space-y-4'>
      {currentThreads?.map((thread) => (
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
                      {getTimeAgo(thread?.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}

      {/* Pagination Controls */}
      {threads.length > 0 ? (
        <div className='flex justify-between items-center mt-4'>
          <button
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
            className='px-4 py-2 bg-gray-200 rounded disabled:opacity-50'
          >
            Previous
          </button>
          <span className='text-sm text-gray-600'>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages}
            className='px-4 py-2 bg-gray-200 rounded disabled:opacity-50'
          >
            Next
          </button>
        </div>
      ) : (
        <div className='text-center text-gray-500 flex items-center justify-center py-28'>
          No threads found
        </div>
      )}
    </div>
  );
};

export default ThreadList;
