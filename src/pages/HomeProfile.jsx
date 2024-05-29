import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import BackButton from '../components/BackButton';
import { Separator } from '../components/ui/separator';
import { useFetchUserById } from '../components/hooks/useFetchUserById';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const profileTabs = [
  { value: 'posts', label: 'Posts', icon: '/request.svg' },
  { value: 'replies', label: 'Replies', icon: '/reply.svg' },
];

const HomeProfile = () => {
  const userId = useParams().id;
  const { user: currentUser } = useFetchUserById(null, userId);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/user/get-comments/${userId}`);
        const data = await res.json();
        setComments(data);

        if (!res.ok) {
          throw new Error(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getComments();
  }, [userId]);

  return (
    <div className='bg-white shadow-lg rounded-lg p-6 md:p-8 lg:p-10'>
      <BackButton />
      <Separator />
      <div className='max-w-screen-md mx-auto'>
        <CardHeader>
          <div className='flex flex-col items-center'>
            <img
              src={
                currentUser.imageUrl ||
                'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
              }
              alt={`${currentUser.username}`}
              className='w-32 h-32 md:w-48 md:h-48 rounded-full object-cover shadow-md border-4 border-primary-500'
            />
            <h2 className='mt-4 text-2xl md:text-3xl font-bold text-primary-500'>
              {currentUser.username}
            </h2>
            <p className='text-gray-600'>{currentUser.bio}</p>
          </div>
        </CardHeader>
        <CardContent className='mt-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center space-x-2'>
              <p className='font-semibold'>Email:</p>
              <p className='text-gray-600'>{currentUser?.email}</p>
            </div>
            <div className='flex items-center space-x-2'>
              <p className='font-semibold'>Role:</p>
              <span className='text-gray-600'>
                {currentUser?.role
                  ? currentUser?.role?.charAt(0).toUpperCase() +
                    currentUser?.role?.slice(1)
                  : 'User'}
              </span>
            </div>
          </div>
        </CardContent>
        <div className='mt-6'>
          <Tabs
            defaultValue='posts'
            className='w-fullbg-white rounded-lg shadow-md p-6'
          >
            <TabsList className='flex justify-center md:justify-start'>
              {profileTabs.map((tab) => (
                <TabsTrigger
                  key={tab.label}
                  value={tab.value}
                  className='flex items-center w-full justify-center text-primary-500 font-bold cursor-pointer transition-colors duration-200 ease-in-out hover:bg-primary-500 hover:text-white rounded-lg  md:px-4 md:py-2'
                >
                  <img
                    src={tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                  <p className='hidden md:inline'>{tab.label}</p>
                  {tab.label === 'Posts' && (
                    <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 text-xs text-light-2'>
                      {currentUser?.posts?.length ?? 0}
                    </p>
                  )}
                  {tab.label === 'Replies' && (
                    <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 text-xs text-light-2'>
                      {comments?.length ?? 0}
                    </p>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value='posts'>
              {currentUser?.posts?.length > 0 ? (
                currentUser?.posts?.map((post) => (
                  <Link to={`/post/${post?._id}`} key={post?._id}>
                    <Card className='p-4 my-4 flex flex-row items-center justify-between bg-gray-100 rounded-lg hover:bg-gray-200'>
                      <span className='text-heading4-medium'>
                        {post?.title}
                      </span>
                      <span className='text-gray-600'>
                        {new Date(post?.createdAt).toLocaleString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        })}
                      </span>
                    </Card>
                  </Link>
                ))
              ) : (
                <p className='text-gray-600 text-center mt-4'>
                  No posts available.
                </p>
              )}
            </TabsContent>
            <TabsContent value='replies'>
              {comments?.length > 0 ? (
                comments?.map((comment) => (
                  <Link to={`/post/${comment?.parentId}`} key={comment?._id}>
                    <Card className='p-4 my-4 flex flex-row items-center justify-between bg-gray-100 rounded-lg hover:bg-gray-200'>
                      <p className='text-heading4-medium'>
                        {comment?.postContent}
                      </p>
                      <p className='text-gray-600'>
                        {new Date(comment?.createdAt).toLocaleString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        })}
                      </p>
                    </Card>
                  </Link>
                ))
              ) : (
                <p className='text-gray-600 text-center mt-4'>
                  No replies available.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HomeProfile;
