import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const GetAdminByUserId = (isChanged) => {
  const { currentUser } = useSelector((state) => state?.user);
  const [admin, setAdmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminById = async () => {
      try {
        if (!currentUser?._id || currentUser?.role !== 'admin') return;
        const res = await fetch(`/api/admin/get/${currentUser?._id}`);
        if (res.ok) {
          const data = await res.json();
          setAdmin(data);
          setLoading(false);
        } else {
          setAdmin([]);
        }
      } catch (error) {
        setError(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminById();
  }, [currentUser, isChanged]);

  return { admin, loading, error };
};
