import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../components/Spinner';
import { Button } from '../components/ui/button';
import { FaTimes } from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';

const ActivityItem = ({ item, onRemove, type }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Card className='hover:shadow-lg transition-shadow duration-300'>
      <CardContent className='p-4 relative'>
        <Button
          onClick={() => onRemove(item._id)}
          className='absolute p-1 top-2 right-2 transition-colors shadow-none bg-transparent hover:bg-gray-200 rounded-full'
        >
          <FaTimes className='text-gray-500' />
        </Button>
        <Link to={`/post/${item.parentId}`}>
          <div className='flex items-center space-x-3'>
            <img
              src={item.author.imageUrl}
              alt='Profile'
              className='w-10 h-10 rounded-full object-cover'
            />
            <div>
              <p className='text-sm font-medium text-gray-800'>
                <span className='font-semibold text-purple-600'>
                  {item.author.username}
                </span>{' '}
                {type === 'reply' ? 'replied to' : 'liked'} your post
              </p>
              <p className='text-xs text-gray-500'>
                {new Date(item.updatedAt).toLocaleString('en-UK', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </p>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  </motion.div>
);

const Activity = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [activity, setActivity] = useState({ replies: [], likes: [] });
  const [loading, setLoading] = useState(true);
  const [hiddenReplies, setHiddenReplies] = useState([]);
  const [hiddenLikes, setHiddenLikes] = useState([]);

  useEffect(() => {
    const getHiddenItems = () => {
      const hiddenRepliesFromStorage =
        JSON.parse(localStorage.getItem('hiddenReplies')) || [];
      const hiddenLikesFromStorage =
        JSON.parse(localStorage.getItem('hiddenLikes')) || [];
      setHiddenReplies(hiddenRepliesFromStorage);
      setHiddenLikes(hiddenLikesFromStorage);
    };
    getHiddenItems();
  }, []);

  useEffect(() => {
    const getActivity = async () => {
      try {
        const res = await fetch(`/api/user/activity/${currentUser?._id}`);
        if (!res.ok) throw new Error('Failed to fetch activity');
        const data = await res.json();
        setActivity(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?._id) getActivity();
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('hiddenReplies', JSON.stringify(hiddenReplies));
  }, [hiddenReplies]);

  useEffect(() => {
    localStorage.setItem('hiddenLikes', JSON.stringify(hiddenLikes));
  }, [hiddenLikes]);

  const handleRemoveReply = (id) => setHiddenReplies((prev) => [...prev, id]);
  const handleRemoveLike = (id) => setHiddenLikes((prev) => [...prev, id]);

  if (loading) return <Spinner />;

  const visibleReplies = activity.replies?.filter(
    (reply) => !hiddenReplies.includes(reply._id)
  );
  const visibleLikes = activity.likes?.filter(
    (like) => !hiddenLikes.includes(like._id)
  );

  return (
    <Card className='max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold text-gray-800'>
          Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='replies' className='w-full'>
          <TabsList className='grid w-full grid-cols-2 mb-6'>
            <TabsTrigger value='replies'>Replies</TabsTrigger>
            <TabsTrigger value='likes'>Likes</TabsTrigger>
          </TabsList>
          <TabsContent value='replies'>
            <div className='space-y-4'>
              <AnimatePresence>
                {visibleReplies.map((reply) => (
                  <ActivityItem
                    key={reply._id}
                    item={reply}
                    onRemove={handleRemoveReply}
                    type='reply'
                  />
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>
          <TabsContent value='likes'>
            <div className='space-y-4'>
              <AnimatePresence>
                {visibleLikes.map((like) => (
                  <ActivityItem
                    key={like._id}
                    item={like}
                    onRemove={handleRemoveLike}
                    type='like'
                  />
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
        {visibleReplies.length === 0 && visibleLikes.length === 0 && (
          <p className='text-gray-600 text-center mt-8'>No activity yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Activity;
