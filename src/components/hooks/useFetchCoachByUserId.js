import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useFetchCoachByUserId = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [coach, setCoach] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoachById = async () => {
      try {
        if (!currentUser?._id) return;
        const res = await fetch(`/api/coach/get/${currentUser?._id}`);
        const data = await res.json();
        setCoach(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachById();
  }, [currentUser?._id]);

  return { coach, loading, error };
};
