import { useEffect, useMemo, useState } from 'react';
import PostCard from '../components/home/posts/PostCard';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner';

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

  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <select
          className='ml-auto px-4 py-1 border border-gray-300 rounded-lg bg-white shadow-sm hover:border-gray-400 focus:ring focus:ring-primary-500 focus:border-primary-500 transition ease-in-out duration-150 appearance-none'
          value={sortOption}
          onChange={handleSort}
        >
          <option value='default'>Default</option>
          <option value='popular'>Most Popular</option>
          <option value='oldest'>Oldest</option>
        </select>
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
