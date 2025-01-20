import { useEffect, useState } from 'react';

export const GetStadiums = () => {
  const [stadiums, setStadiums] = useState([
    {
      id: '',
      name: '',
    },
  ]);

  useEffect(() => {
    const fetchStadiumData = async () => {
      try {
        const res = await fetch('/api/admin/stadium');
        if (!res.ok) {
          throw new Error('Failed to fetch stadium data!');
        }
        const data = await res.json();
        setStadiums(
          data?.map((stadium) => ({ id: stadium._id, name: stadium.name }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchStadiumData();
  }, []);

  return stadiums;
};
