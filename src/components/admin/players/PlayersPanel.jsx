/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import CustomDataTable from '../../CustomDataTable';

const PlayersPanel = ({ columns }) => {
  const [players, setPlayers] = useState([]);

  const getPlayers = async () => {
    try {
      const res = await fetch('/api/player/get');
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch data!');
      }
      const data = await res.json();
      setPlayers(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(players);

  useEffect(() => {
    getPlayers();
  }, []);

  return (
    <>
      <CustomDataTable columns={columns} data={players} pagination />
    </>
  );
};

export default PlayersPanel;
