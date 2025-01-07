import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const GetPlayerByUserId = (isChanged) => {
  const { currentUser } = useSelector((state) => state.user);
  const [player, setPlayer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerById = async () => {
      try {
        if (!currentUser?._id || currentUser?.role !== 'player') {
          return;
        }
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
  }, [currentUser?._id, currentUser?.role, isChanged]);

  return { player, loading, error, currentUser };
};
