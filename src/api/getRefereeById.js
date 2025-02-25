import { useEffect, useState } from 'react';

export const GetRefereeById = (id) => {
  const [referee, setReferee] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRefereeById = async () => {
      try {
        if (!id) return;
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/referee/${id}`
        );
        const data = await res.json();
        setReferee(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRefereeById();
  }, [id]);

  return { referee, loading };
};
