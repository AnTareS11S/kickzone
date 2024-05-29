import Spinner from '../../components/Spinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import BackButton from '../../components/BackButton';
import { Separator } from '../../components/ui/separator';
import { useParams } from 'react-router-dom';
import { useFetchPlayerById } from '../../components/hooks/useFetchPlayerById';
import CustomDataTable from '../../components/CustomDataTable';
import { useFetchPlayerStatsById } from '../../components/hooks/useFetchPlayerStatsById';
import {
  FaFlag,
  FaRulerVertical,
  FaWeight,
  FaBirthdayCake,
} from 'react-icons/fa';

const PlayerDetails = () => {
  const playerId = useParams().id;
  const { player, loading } = useFetchPlayerById(playerId);
  const { playerStats } = useFetchPlayerStatsById(playerId);

  const columns = [
    {
      name: 'Season',
      selector: (row) => row.season,
      sortable: true,
    },
    {
      name: 'Goals',
      selector: (row) => row.goals,
      sortable: true,
      grow: 0.5,
    },
    {
      name: 'Assists',
      selector: (row) => row.assists,
      sortable: true,
      grow: 0.5,
    },
    {
      name: 'Yellow Cards',
      selector: (row) => row.yellowCards,
      sortable: true,
      grow: 0.5,
    },
    {
      name: 'Red Cards',
      selector: (row) => row.redCards,
      sortable: true,
      grow: 0.5,
    },
    {
      name: 'Clean Sheets',
      selector: (row) => row.cleanSheets,
      sortable: true,
      grow: 0.5,
    },
    {
      name: 'Own Goals',
      selector: (row) => row.ownGoals,
      sortable: true,
      grow: 0.5,
    },
    {
      name: 'Minutes Played',
      selector: (row) => row.minutesPlayed,
      sortable: true,
      grow: 0.5,
    },
  ];

  if (loading) {
    return <Spinner />;
  }

  return (
    <article className='py-8'>
      <BackButton />
      <Separator />
      <Card className='bg-white shadow-lg rounded-lg flex flex-col'>
        <CardHeader className='bg-gray-100 p-6  md:flex-row items-center'>
          <div className='w-40 h-40 rounded-full  mb-4 md:mb-0 md:mr-6'>
            <img
              src={
                player?.imageUrl ||
                'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
              }
              alt={`Photo of ${player?.name}`}
              className='object-cover w-full h-full'
            />
          </div>
          <div>
            <CardTitle className='text-2xl font-bold mb-2'>
              {player?.name + ' ' + player?.surname}
            </CardTitle>
            <CardDescription className='text-gray-600'>
              {player?.position} | {player?.currentTeam}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='p-6 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Personal Information</h3>
            <div className='flex items-center mb-2'>
              <FaBirthdayCake className='text-gray-500 mr-2' />
              <p className='text-gray-700'>{player?.age}</p>
            </div>
            <div className='flex items-center mb-2'>
              <FaFlag className='text-gray-500 mr-2' />
              <p className='text-gray-700'>{player?.nationality}</p>
            </div>
            <div className='flex items-center mb-2'>
              <FaRulerVertical className='text-gray-500 mr-2' />
              <p className='text-gray-700'>{player?.height}</p>
            </div>
            <div className='flex items-center mb-2'>
              <FaWeight className='text-gray-500 mr-2' />
              <p className='text-gray-700'>{player?.weight}</p>
            </div>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Previous Teams</h3>
            <ul className='list-disc pl-4 text-gray-700'>
              {player.teams?.map((team, index) => (
                <li key={index}>{team.split(':')[0]}</li>
              ))}
            </ul>
          </div>
        </CardContent>
        <div className='p-6 grid'>
          <h3 className='text-lg font-semibold mb-4'>Player Stats</h3>
          <CustomDataTable
            columns={columns}
            data={playerStats}
            pending
            searchable={false}
          />
        </div>
      </Card>
    </article>
  );
};

export default PlayerDetails;
