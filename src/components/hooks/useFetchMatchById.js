/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

export const useFetchMatchById = (id) => {
  const [match, setMatch] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchMatchById = async () => {
    try {
      if (!id) {
        return;
      }
      setLoading(true);
      const res = await fetch(`/api/referee/get-match/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch match data!');
      }
      const data = await res.json();
      setMatch(data);
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

    fetchMatchById();
  }, [id]);

  return match;
};
