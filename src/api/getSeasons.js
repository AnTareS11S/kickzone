import { useEffect, useState } from 'react';

export const GetSeasons = () => {
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    const fetchSeasonsData = async () => {
      try {
        const res = await fetch('/api/admin/season');
        if (!res.ok) {
          throw new Error('Failed to fetch seasons data!');
        }
        const data = await res.json();
        setSeasons(data.map((season) => season.name + ':' + season._id));
      } catch (error) {
        console.log(error);
      }
    };

    fetchSeasonsData();
  }, []);

  return seasons;
};
