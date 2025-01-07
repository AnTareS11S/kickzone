import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import BackButton from '../components/BackButton';
import { Separator } from '../components/ui/separator';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FaEnvelope,
  FaUserTag,
  FaRegCommentDots,
  FaRegFileAlt,
} from 'react-icons/fa';
import Spinner from '../components/Spinner';
import { GetUserById } from '../api/getUserById';

const profileTabs = [
  { value: 'posts', label: 'Posts', icon: FaRegFileAlt },
  { value: 'replies', label: 'Replies', icon: FaRegCommentDots },
];

const HomeProfile = () => {
  const userId = useParams().id;
  const { user: currentUser, loading } = GetUserById(null, userId);
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

  if (loading) return <Spinner />;

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <BackButton className='text-white hover:text-gray-200 transition-colors duration-200' />
      <Card className='bg-white shadow-xl rounded-lg overflow-hidden'>
        <CardHeader className='bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6'>
          <Separator className='my-4 opacity-50' />
          <div className='flex flex-col items-center'>
            <img
              src={
                currentUser.imageUrl ||
                'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
              }
              alt={`${currentUser.username}`}
              className='w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-lg'
            />
            <h2 className='mt-4 text-3xl md:text-4xl font-bold'>
              {currentUser.username}
            </h2>
            <p className='text-gray-200 mt-2'>{currentUser.bio}</p>
          </div>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex items-center space-x-3'>
              <FaEnvelope className='text-gray-500' />
              <p className='text-gray-700'>{currentUser?.email}</p>
            </div>
            <div className='flex items-center space-x-3'>
              <FaUserTag className='text-gray-500' />
              <p className='text-gray-700'>
                {currentUser?.role
                  ? currentUser?.role?.charAt(0).toUpperCase() +
                    currentUser?.role?.slice(1)
                  : 'User'}
              </p>
            </div>
          </div>
          <div className='mt-8'>
            <Tabs defaultValue='posts' className='w-full'>
              <TabsList className='flex justify-center mb-6'>
                {profileTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.label}
                    value={tab.value}
                    className='flex items-center px-4 py-2 text-gray-600 font-semibold transition-colors duration-200 hover:text-primary-500'
                  >
                    <tab.icon className='mr-2' />
                    <span>{tab.label}</span>
                    <span className='ml-2 bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs'>
                      {tab.value === 'posts'
                        ? currentUser?.posts?.length ?? 0
                        : comments?.length ?? 0}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value='posts'>
                {currentUser?.posts?.length > 0 ? (
                  <div className='space-y-4'>
                    {currentUser?.posts?.map((post) => (
                      <Link to={`/post/${post?._id}`} key={post?._id}>
                        <Card className='hover:shadow-md transition-shadow duration-200'>
                          <CardContent className='p-4 flex justify-between items-center'>
                            <h3 className='text-lg font-semibold text-gray-800'>
                              {post?.title}
                            </h3>
                            <span className='text-sm text-gray-500'>
                              {new Date(post?.createdAt).toLocaleString(
                                'en-US',
                                {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )}
                            </span>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className='text-center text-gray-500'>
                    No posts available.
                  </p>
                )}
              </TabsContent>
              <TabsContent value='replies'>
                {comments?.length > 0 ? (
                  <div className='space-y-4'>
                    {comments?.map((comment) => (
                      <Link
                        to={`/post/${comment?.parentId}`}
                        key={comment?._id}
                      >
                        <Card className='hover:shadow-md transition-shadow duration-200'>
                          <CardContent className='p-4'>
                            <p className='text-gray-800'>
                              {comment?.postContent}
                            </p>
                            <p className='text-sm text-gray-500 mt-2'>
                              {new Date(comment?.createdAt).toLocaleString(
                                'en-US',
                                {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                }
                              )}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className='text-center text-gray-500'>
                    No replies available.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeProfile;
