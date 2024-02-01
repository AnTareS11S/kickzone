/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

export const useFetchTrainingsByCoachId = (id) => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrainingsByCoachId = async () => {
    try {
      if (!id) {
        return;
      }
      setLoading(true);
      const res = await fetch(`/api/admin/training/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch trainings data!');
      }
      const data = await res.json();
      setTrainings(data);
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

    fetchTrainingsByCoachId();
  }, [id]);

  return { trainings, loading };
};
