import { useEffect, useState } from 'react';

export const useFetchStadiums = () => {
  const [stadiums, setStadiums] = useState([]);

  useEffect(() => {
    const fetchStadiumData = async () => {
      try {
        const res = await fetch('/api/admin/stadium');
        if (!res.ok) {
          throw new Error('Failed to fetch stadium data!');
        }
        const data = await res.json();
        setStadiums(data.map((coach) => coach.name + ':' + coach._id));
      } catch (error) {
        console.log(error);
      }
    };

    fetchStadiumData();
  }, []);

  return stadiums;
};
