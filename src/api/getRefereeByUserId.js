import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const GetRefereeByUserId = (isChanged) => {
  const { currentUser } = useSelector((state) => state.user);
  const [referee, setReferee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRefereeById = async () => {
      try {
        if (!currentUser?._id || currentUser?.role !== 'Referee') {
          return;
        }
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/referee/get/${
            currentUser?._id
          }`
        );
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
  }, [currentUser?._id, currentUser?.role, isChanged]);

  return { referee, loading, error };
};
