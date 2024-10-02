import { motion } from 'framer-motion';
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
  const { id: teamId } = useParams();
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='mb-8'
        key={position}
      >
        <h3 className='text-2xl font-bold mb-4 text-purple-700'>{position}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-1/5'>Image</TableHead>
              <TableHead className='w-1/5'>Name</TableHead>
              <TableHead className='w-1/5'>Surname</TableHead>
              <TableHead className='w-1/5'>Age</TableHead>
              <TableHead className='w-1/5'>Position</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlayers.map((player) => (
              <TableRow
                key={player._id}
                className='cursor-pointer hover:bg-purple-50 transition-colors duration-200'
                onClick={() => navigate(`/player/${player._id}`)}
              >
                <TableCell>
                  <img
                    src={
                      player?.imageUrl ||
                      'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
                    }
                    alt={`${player.name} ${player.surname}`}
                    className='w-12 h-12 rounded-full object-cover'
                  />
                </TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.surname}</TableCell>
                <TableCell>{player.age}</TableCell>
                <TableCell>{player.position}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='p-4'>
      {playersData?.length ? (
        Object.keys(playerPositions).map((position) =>
          renderPlayerList(position)
        )
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='text-center text-gray-600 text-xl'
        >
          No players found
        </motion.div>
      )}
    </div>
  );
};

export default SquadTable;
