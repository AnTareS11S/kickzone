/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useFetchCoachByUserId = () => {
  const { currentUser } = useSelector((state) => state?.user);
  const [coach, setCoach] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchCoachById = async () => {
    try {
      if (!currentUser || currentUser?.role !== 'coach') {
        return null;
      }
      setLoading(true);

      const res = await fetch(`/api/coach/get/${currentUser?._id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch coach data!');
      }
      const data = await res.json();
      setCoach(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (loading) {
      return;
    }

    fetchCoachById();
  }, [currentUser]);

  return coach;
};
