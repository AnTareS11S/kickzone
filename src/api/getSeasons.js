import { useEffect, useState } from 'react';

export const GetSeasons = () => {
  const [seasons, setSeasons] = useState([
    {
      id: '',
      name: '',
    },
  ]);

  useEffect(() => {
    const fetchSeasonsData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/season`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch seasons data!');
        }
        const data = await res.json();
        setSeasons(
          data?.map((season) => ({ id: season._id, name: season.name }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchSeasonsData();
  }, []);

  return seasons;
};
