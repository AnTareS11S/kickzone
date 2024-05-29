import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../Spinner';
import { useFetchTeamPlayers } from '../../hooks/useFetchTeamPlayers';

const SquadTable = () => {
  const teamId = useParams().id;
  const navigate = useNavigate();
  const { players: playersData, loading } = useFetchTeamPlayers(teamId);

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
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
          {position}
        </h2>
        <div className='overflow-x-auto'>
          <Table className='min-w-full divide-y divide-gray-200 shadow-sm'>
            <TableHeader className='bg-gray-50'>
              <TableRow>
                <TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Image
                </TableHead>
                <TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Name
                </TableHead>
                <TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Surname
                </TableHead>
                <TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Age
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='bg-white divide-y divide-gray-200'>
              {filteredPlayers.map((player) => (
                <TableRow
                  key={player._id}
                  className='hover:bg-gray-100 cursor-pointer'
                  onClick={() => navigate(`/player/${player._id}`)}
                >
                  <TableCell className='px-6 py-4 whitespace-nowrap'>
                    <img
                      src={
                        player?.imageUrl ||
                        'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
                      }
                      alt={player.name}
                      className='w-10 h-10 rounded-full object-cover'
                    />
                  </TableCell>
                  <TableCell className='px-6 py-4 whitespace-nowrap'>
                    {player.name}
                  </TableCell>
                  <TableCell className='px-6 py-4 whitespace-nowrap'>
                    {player.surname}
                  </TableCell>
                  <TableCell className='px-6 py-4 whitespace-nowrap'>
                    {player.age}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      {playersData?.length ? (
        Object.keys(playerPositions).map((position) => (
          <div key={position}>{renderPlayerList(position)}</div>
        ))
      ) : (
        <p className='text-center text-gray-500'>No players found</p>
      )}
    </div>
  );
};

export default SquadTable;
