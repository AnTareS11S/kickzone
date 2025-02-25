import { useEffect, useState } from 'react';

export const GetCoaches = () => {
  const [coaches, setCoaches] = useState([
    {
      id: '',
      name: '',
    },
  ]);

  useEffect(() => {
    const fetchCoachesData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/coach`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch coaches data!');
        }
        const data = await res.json();
        setCoaches(
          data?.map((coach) => ({
            id: coach._id,
            name: coach.name + ' ' + coach.surname,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchCoachesData();
  }, []);

  return coaches;
};
