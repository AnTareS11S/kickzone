import { useEffect, useState } from 'react';

export const useFetchCoachById = (id) => {
  const [coach, setCoach] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoachById = async () => {
      try {
        if (!id) {
          return;
        }
        setLoading(true);
        const res = await fetch(`/api/coach/${id}`);
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

    fetchCoachById();
  }, [id]);

  return { coach, loading };
};
