import { useEffect, useState } from 'react';

export const GetRefeeres = () => {
  const [referees, setReferees] = useState([
    {
      id: '',
      name: '',
    },
  ]);

  useEffect(() => {
    const fetchRefereesData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/referee`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch referees data!');
        }
        const data = await res.json();
        setReferees(
          data.map((referee) => ({
            id: referee._id,
            name: `${referee.name} ${referee.surname}`,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchRefereesData();
  }, []);

  return referees;
};
