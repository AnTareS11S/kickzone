import { useEffect, useState } from 'react';

export const GetSponsors = () => {
  const [sponsors, setSponsors] = useState([
    {
      id: '',
      name: '',
    },
  ]);

  useEffect(() => {
    const fetchSponsorsData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/sponsor`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch sponsors data!');
        }
        const data = await res.json();
        setSponsors(
          data?.map((sponsor) => ({ id: sponsor._id, name: sponsor.name }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchSponsorsData();
  }, []);

  return sponsors;
};
