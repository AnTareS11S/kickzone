import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useFetchCompletedMatches = (id, isResultApproved) => {
  const { currentUser } = useSelector((state) => state.user);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMatchesData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/referee/completed-matches/${id}?userId=${currentUser?._id}`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch matches data!');
        }
        const data = await res.json();

        setMatches(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchesData();
  }, [id, isResultApproved, currentUser._id]);

  return { matches, loading };
};
