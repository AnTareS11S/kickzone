import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const GetCoachByUserId = (isChanged) => {
  const { currentUser } = useSelector((state) => state?.user);
  const [coach, setCoach] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoachById = async () => {
      try {
        if (!currentUser?._id || currentUser?.role !== 'coach') return;
        const res = await fetch(`/api/coach/get/${currentUser?._id}`);
        if (res.ok) {
          const data = await res.json();
          setCoach(data);
          setLoading(false);
        } else {
          setCoach([]);
        }
      } catch (error) {
        setError(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachById();
  }, [currentUser, isChanged]);

  return { coach, loading, error };
};
