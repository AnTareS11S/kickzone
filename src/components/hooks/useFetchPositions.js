import { useEffect, useState } from 'react';

export const useFetchPositions = () => {
  const [positions, sePositions] = useState([]);

  useEffect(() => {
    const fetchPositionData = async () => {
      try {
        const res = await fetch('/api/admin/position');
        if (!res.ok) {
          throw new Error('Failed to fetch positions data!');
        }
        const data = await res.json();
        sePositions(data.map((position) => position.name + ':' + position._id));
      } catch (error) {
        console.log(error);
      }
    };

    fetchPositionData();
  }, []);

  return positions;
};
