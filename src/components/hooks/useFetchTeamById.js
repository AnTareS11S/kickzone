import { useEffect, useState } from 'react';

export const useFetchTeamById = (id) => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamById = async () => {
      try {
        const res = await fetch(`/api/team/${id}`);
        const data = await res.json();
        setTeam(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamById();
  }, [id]);

  return { team, loading, error };
};
