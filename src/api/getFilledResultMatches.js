import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const GetFilledResultMatches = (id, isEdited) => {
  const { currentUser } = useSelector((state) => state.user);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMatchesData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/referee/filled-matches/${id}?userId=${currentUser?._id}`
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
  }, [id, isEdited, currentUser._id]);

  return { matches, loading };
};
