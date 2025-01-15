import PostCard from '../../components/home/posts/PostCard';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Comment from '../../components/home/posts/Comment';
import Spinner from '../../components/Spinner';
import { GetPostById } from '../../api/getPostById';
import { GetUserById } from '../../api/getUserById';

const PostPage = () => {
  const { id } = useParams();
  const { user, currentUser } = GetUserById();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const { post, loading } = GetPostById(id, updateSuccess, deleteSuccess);

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className='relative'>
      <div>
        <PostCard
          key={post._id}
          id={post._id}
          currentUserId={currentUser?._id || ''}
          currentUserImg={user?.imageUrl}
          currentUsername={currentUser?.username}
          parentId={post.parentId}
          content={post.postContent}
          author={post.author}
          title={post.title}
          initialLikes={post.likes}
          postPhoto={post.imageUrl}
          createdAt={post.createdAt}
          setDeleteSuccess={setDeleteSuccess}
          comments={post.children}
        />
      </div>
      <div className='mt-7'>
        <Comment
          postId={id}
          currentUserId={currentUser?._id}
          currentUsername={currentUser?.username}
          currentUserImg={user?.imageUrl}
          isLogged={currentUser === null ? false : true}
          authorId={post.author?._id}
          setUpdateSuccess={setUpdateSuccess}
        />
      </div>
      <div className='mt-10'>
        {post.children?.map((comment) => (
          <PostCard
            key={comment._id}
            id={comment._id}
            currentUserId={currentUser?._id || ''}
            currentUserImg={user?.imageUrl}
            currentUsername={currentUser?.username}
            parentId={comment.parentId}
            content={comment.postContent}
            author={comment.author}
            initialLikes={comment.likes}
            createdAt={comment.createdAt}
            comments={comment.children}
            setDeleteSuccess={setDeleteSuccess}
            mainPostAuthorId={post.author._id}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default PostPage;
