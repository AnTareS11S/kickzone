import { useEffect, useState } from 'react';

export const useFetchAdminByUserId = (id) => {
  const [admin, setAdmin] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminById = async () => {
      try {
        if (!id) return;
        const res = await fetch(`/api/admin/${id}`);
        const data = await res.json();
        setAdmin(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminById();
  }, [id]);

  return { admin, loading };
};
