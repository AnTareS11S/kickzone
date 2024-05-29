import { useEffect, useState } from 'react';

export const useFetchResultsAndMatchesByTeamId = (id) => {
  const [results, setResults] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResultsData = async () => {
      try {
        const res = await fetch(`/api/team/results/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch results data!');
        }
        const data = await res.json();

        setResults(data.results);
        setMatches(data.matches);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchResultsData();
  }, [id]);

  return { results, matches, loading };
};
