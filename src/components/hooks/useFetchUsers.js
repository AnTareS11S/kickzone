import { useEffect, useState } from 'react';

export const useFetchUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const res = await fetch('/api/admin/users');
        if (!res.ok) {
          throw new Error('Failed to fetch user data!');
        }
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsersData();
  }, []);

  return users;
};
