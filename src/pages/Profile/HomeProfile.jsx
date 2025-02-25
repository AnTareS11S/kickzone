import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import BackButton from '../../components/BackButton';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaCalendar, FaUser, FaEnvelopeOpen } from 'react-icons/fa';
import Spinner from '../../components/Spinner';
import { GetUserById } from '../../api/getUserById';
import { Badge } from '../../components/ui/badge';
import { MdChatBubble } from 'react-icons/md';
import { IoMdDocument } from 'react-icons/io';
import ReportModal from '../Report/ReportModal';

const profileTabs = [
  { value: 'posts', label: 'Posts', icon: IoMdDocument },
  { value: 'replies', label: 'Replies', icon: MdChatBubble },
];

const HomeProfile = () => {
  const { id: userId } = useParams();
  const { user, currentUser, loading } = GetUserById(null, userId);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/get-comments/${userId}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    getComments();
  }, [userId]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  return (
    <div className='min-h-screen'>
      <div className='container mx-auto px-4 py-8 max-w-8xl'>
        <BackButton />

        <Card className='bg-white  shadow-xl rounded-lg overflow-hidden'>
          <CardHeader className='relative p-0'>
            {/* Cover Image */}
            <div className='h-16 bg-gradient-to-r from-purple-300 to-white' />

            {/* Profile Section */}
            <div className='px-6 pb-6 -mt-24'>
              <div className='flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6'>
                <img
                  src={
                    user.imageUrl ||
                    'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
                  }
                  alt={user.username}
                  className='w-36 h-36 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover'
                />
                <div className='flex-1'>
                  <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {user.username}
                  </h1>
                  <p className='mt-2 text-gray-600 dark:text-gray-300'>
                    {user.bio || 'No bio available'}
                  </p>

                  <div className='mt-4 flex flex-wrap gap-4'>
                    <div className='flex items-center text-gray-600 dark:text-gray-300'>
                      <FaEnvelopeOpen className='w-4 h-4 mr-2' />
                      {user.email}
                    </div>
                    <div className='flex items-center text-gray-600 dark:text-gray-300'>
                      <FaUser className='w-4 h-4 mr-2' />
                      <Badge variant='secondary'>
                        {user?.role?.charAt(0).toUpperCase() +
                          user?.role?.slice(1) || 'User'}
                      </Badge>
                    </div>
                    {user && currentUser?._id !== userId && (
                      <ReportModal
                        currentUserId={currentUser?._id}
                        reportedUserId={userId}
                        contentType={'Profile'}
                        contentId={userId}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className='p-6'>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='w-full'
            >
              <TabsList className='flex justify-center mb-6  p-1 rounded-lg'>
                {profileTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className='flex items-center px-4 py-2 space-x-2'
                  >
                    <tab.icon className='w-4 h-4' />
                    <span>{tab.label}</span>
                    <Badge variant='secondary' className='ml-2'>
                      {tab.value === 'posts'
                        ? user?.posts?.length ?? 0
                        : comments?.length ?? 0}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value='posts'>
                {user?.posts?.length > 0 ? (
                  <div className='grid gap-4'>
                    {user.posts.map((post) => (
                      <Link to={`/post/${post._id}`} key={post._id}>
                        <Card className='hover:shadow-lg transition-all duration-200 hover:scale-[1.01]'>
                          <CardContent className='p-4'>
                            <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                              {post.title}
                            </h3>
                            <div className='mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400'>
                              <FaCalendar className='w-4 h-4 mr-2' />
                              {formatDate(post.createdAt)}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-12'>
                    <IoMdDocument className='mx-auto h-12 w-12 text-gray-400' />
                    <p className='mt-2 text-gray-500 dark:text-gray-400'>
                      No posts available yet.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value='replies'>
                {comments?.length > 0 ? (
                  <div className='grid gap-4'>
                    {comments.map((comment) => (
                      <Link to={`/post/${comment.parentId}`} key={comment._id}>
                        <Card className='hover:shadow-lg transition-all duration-200 hover:scale-[1.01]'>
                          <CardContent className='p-4'>
                            <p className='text-gray-800 dark:text-gray-200'>
                              {comment.postContent}
                            </p>
                            <div className='mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400'>
                              <FaCalendar className='w-4 h-4 mr-2' />
                              {formatDate(comment.createdAt)}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-12'>
                    <MdChatBubble className='mx-auto h-12 w-12 text-gray-400' />
                    <p className='mt-2 text-gray-500 dark:text-gray-400'>
                      No replies available yet.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeProfile;
