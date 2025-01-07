import { useEffect, useState } from 'react';

export const GetRefeeres = () => {
  const [referees, setReferees] = useState([]);

  useEffect(() => {
    const fetchRefereesData = async () => {
      try {
        const res = await fetch('/api/admin/referee');
        if (!res.ok) {
          throw new Error('Failed to fetch referees data!');
        }
        const data = await res.json();
        setReferees(
          data.map(
            (referee) =>
              referee.name + ' ' + referee.surname + ':' + referee._id
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchRefereesData();
  }, []);

  return referees;
};
