import { useEffect, useState } from 'react';
import PostCard from '../components/home/posts/PostCard';
import { useSelector } from 'react-redux';
const Home = () => {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/all');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <h1 className='head-text text-dark-2 text-left'>Home</h1>
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
                content={post.postContent}
                author={post.author}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
};

export default Home;
