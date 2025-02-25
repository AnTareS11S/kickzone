import { useEffect, useState } from 'react';

export const GetUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/users`
        );
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
