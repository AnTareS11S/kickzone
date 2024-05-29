import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useFetchUserById = (isChanged, userId = null) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        if (!currentUser?._id) return;
        const res = await fetch(
          `/api/user/get/${userId ? userId : currentUser?._id}`
        );
        const data = await res.json();
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [currentUser?._id, isChanged, userId]);

  return { user, loading, currentUser };
};
