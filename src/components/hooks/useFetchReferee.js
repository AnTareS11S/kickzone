import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useFetchRefereeByUserId = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [referee, setReferee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRefereeById = async () => {
      try {
        const res = await fetch(`/api/referee/get/${currentUser?._id}`);
        const data = await res.json();
        setReferee(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRefereeById();
  }, [currentUser?._id]);

  return { referee, loading, error };
};
