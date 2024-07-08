import { useEffect, useState } from 'react';
import PostCard from '../components/home/posts/PostCard';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
const Home = () => {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

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

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <section className='mt-9 flex flex-col gap-10'>
        {posts.length === 0 ? (
          <p className='no-result'>No posts found</p>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                id={post._id}
                currentUserId={currentUser?._id || ''}
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
