import { useSelector } from 'react-redux';
import PostCard from '../components/home/posts/PostCard';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Comment from '../components/home/posts/Comment';

const PostPage = () => {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [post, setPost] = useState({});

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/get/${id}`);
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, [id, updateSuccess]);

  return (
    <section className='relative'>
      <div>
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
      </div>
      <div className='mt-7'>
        <Comment
          postId={id}
          currentUserImg={currentUser.photo}
          setUpdateSuccess={setUpdateSuccess}
        />
      </div>
      <div className='mt-10'>
        {post.children?.map((comment) => (
          <PostCard
            key={comment._id}
            id={comment._id}
            currentUserId={currentUser?._id || ''}
            parentId={comment.parentId}
            content={comment.postContent}
            author={comment.author}
            createdAt={comment.createdAt}
            comments={comment.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default PostPage;
