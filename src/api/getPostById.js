import { useEffect, useState } from 'react';

export const GetPostById = (id, updateSuccess, deleteSuccess) => {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostById = async () => {
      try {
        const res = await fetch(`/api/post/get/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch post data!');
        }
        const data = await res.json();
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPostById();
  }, [id, updateSuccess, deleteSuccess]);

  return { post, loading };
};
