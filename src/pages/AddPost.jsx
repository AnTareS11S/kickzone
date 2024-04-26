import PostForm from '../components/home/posts/PostForm';
import { Separator } from '../components/ui/separator';

const AddPost = () => {
  return (
    <>
      <h1 className='head-text text-dark-2 mb-9 text-left'>Create post</h1>
      <Separator className='mb-10' />
      <PostForm />
    </>
  );
};

export default AddPost;
