import { useEffect, useState } from 'react';

export const GetSponsors = () => {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const fetchSponsorsData = async () => {
      try {
        const res = await fetch('/api/admin/sponsor');
        if (!res.ok) {
          throw new Error('Failed to fetch sponsors data!');
        }
        const data = await res.json();
        setSponsors(data.map((sponsor) => sponsor.name + ':' + sponsor._id));
      } catch (error) {
        console.log(error);
      }
    };

    fetchSponsorsData();
  }, []);

  return sponsors;
};
