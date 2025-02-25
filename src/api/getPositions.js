import { useEffect, useState } from 'react';

export const GetPositions = () => {
  const [positions, sePositions] = useState([
    {
      id: '',
      name: '',
    },
  ]);

  useEffect(() => {
    const fetchPositionData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/position`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch positions data!');
        }
        const data = await res.json();
        sePositions(
          data?.map((position) => ({ id: position._id, name: position.name }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchPositionData();
  }, []);

  return positions;
};
