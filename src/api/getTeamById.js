import { useEffect, useState } from 'react';

export const GetTeamById = (id, isChanged) => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamById = async () => {
      try {
        if (!id) return;
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
  }, [id, isChanged]);

  return { team, loading, error };
};
