/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';

import { useNavigate } from 'react-router-dom';
import Spinner from '../../Spinner';

const SquadTable = ({ data }) => {
  const [playersData, setPlayersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { players } = data;
  const navigate = useNavigate();

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/player/get-players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerIds: players }),
      });
      const data = await res.json();
      setPlayersData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [players]);

  const playerPositions = {
    Goalkeepers: ['Goalkeeper'],
    Defenders: ['Center back', 'Left outside back', 'Right outside back'],
    Midfielders: [
      'Defensive midfielder',
      'Center midfielder',
      'Left midfielder',
      'Right midfielder',
    ],
    Forwards: ['Striker', 'Left winger', 'Right winger'],
  };

  const renderPlayerList = (position) => {
    const filteredPlayers = playersData?.filter((player) =>
      playerPositions[position].includes(player.position)
    );

    return (
      <div className='mb-4 mt-5 w-full flex flex-col'>
        <h2 className='text-heading4-medium mb-2 text-center text-gray-700 bg-slate-200 p-3'>
          {position}
        </h2>
        <div className='overflow-x-auto'>
          <Table className='min-w-full'>
            <TableHeader className='border-b '>
              <TableRow>
                <TableHead className='py-3 px-4 w-1/6 max-sm:hidden'></TableHead>
                <TableHead className='py-3 px-4 w-2/6'>Name</TableHead>
                <TableHead className='py-3 px-4 w-2/6'>Surname</TableHead>
                <TableHead className='py-3 px-4 w-1/6'>Age</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.map((player) => (
                <TableRow
                  key={player._id}
                  className='border-b border-gray-300 hover:bg-gray-200 cursor-pointer'
                  onClick={() => navigate(`/player/${player._id}`)}
                >
                  <TableCell className='py-2 px-4 max-sm:hidden'>
                    <img
                      src={player.photo}
                      alt=''
                      className='object-contain w-10 h-10 rounded-full '
                    />
                  </TableCell>
                  <TableCell className='py-2 px-4'>{player.name}</TableCell>
                  <TableCell className='py-2 px-4'>{player.surname}</TableCell>
                  <TableCell className='py-2 px-4'>{player.age}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className=''>
      {Object.keys(playerPositions).map((position) => (
        <div key={position}>{renderPlayerList(position)}</div>
      ))}
    </div>
  );
};

export default SquadTable;
