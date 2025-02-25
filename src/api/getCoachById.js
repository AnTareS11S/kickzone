import { useEffect, useState } from 'react';

export const GetCoachById = (id) => {
  const [coach, setCoach] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoachById = async () => {
      try {
        if (!id) return;
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/coach/${id}`
        );
        const data = await res.json();
        setCoach(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachById();
  }, [id]);

  return { coach, loading };
};
