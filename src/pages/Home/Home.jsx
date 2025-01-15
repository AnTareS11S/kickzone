import { useEffect, useMemo, useState } from 'react';
import PostCard from '../../components/home/posts/PostCard';
import { useSelector } from 'react-redux';
import Spinner from '../../components/Spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/post/all');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [deleteSuccess]);

  const sortedPosts = useMemo(() => {
    let sorted = [...posts];
    switch (sortOption) {
      case 'popular':
        sorted.sort((a, b) => b.likes.length - a.likes.length);
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    return sorted;
  }, [posts, sortOption]);

  const handleSort = (value) => {
    setSortOption(value);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className='flex items-center gap-2 justify-between mb-2'>
        <div />
        <Select value={sortOption} onValueChange={handleSort}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filters' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='default'>Default</SelectItem>
            <SelectItem value='popular'>Most Popular</SelectItem>
            <SelectItem value='oldest'>Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <section className='mt-9 flex flex-col gap-10'>
        {sortedPosts.length === 0 ? (
          <p className='no-result'>No posts found</p>
        ) : (
          <>
            {sortedPosts.map((post) => (
              <PostCard
                key={post._id}
                id={post._id}
                currentUserId={currentUser?._id || ''}
                currentUserImg={currentUser?.imageUrl}
                currentUsername={currentUser?.username}
                parentId={post.parentId}
                title={post.title}
                initialLikes={post.likes}
                content={post.postContent}
                postPhoto={post.imageUrl}
                author={post.author}
                createdAt={post.createdAt}
                comments={post.children}
                setDeleteSuccess={setDeleteSuccess}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
};

export default Home;
