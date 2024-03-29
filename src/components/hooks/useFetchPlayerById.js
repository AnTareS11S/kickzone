import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useFetchPlayerById = () => {
  const { currentUser } = useSelector((state) => state?.user);
  const [player, setPlayer] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlayerById = async () => {
      try {
        if (!currentUser?._id) {
          return;
        }
        setLoading(true);
        const res = await fetch(`/api/player/get/${currentUser?._id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch player data!');
        }
        const data = await res.json();
        setPlayer(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerById();
  }, [currentUser]);

  return { player, loading };
};
