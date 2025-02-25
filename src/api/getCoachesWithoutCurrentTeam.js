import { useEffect, useState } from 'react';

export const GetCoachesWithoutCurrentTeam = () => {
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    const fetchCoachesData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/coach/coaches-without-team`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch coaches data!');
        }
        const data = await res.json();
        setCoaches(
          data.map(
            (coach) => coach.name + ' ' + coach.surname + ':' + coach._id
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchCoachesData();
  }, []);

  return coaches;
};
