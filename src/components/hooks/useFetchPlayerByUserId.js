import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useFetchPlayerByUserId = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [player, setPlayer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerById = async () => {
      try {
        if (!currentUser?._id) return;
        const res = await fetch(`/api/player/get/${currentUser?._id}`);
        const data = await res.json();
        setPlayer(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerById();
  }, [currentUser?._id]);

  return { player, loading, error, currentUser };
};
