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
import { useEffect, useState } from 'react';
import { useToast } from '../../components/ui/use-toast';
import { useSelector } from 'react-redux';
import { Button } from '../../components/ui/button';

const PlayerDetails = () => {
  const playerId = useParams().id;
  const { currentUser } = useSelector((state) => state.user);
  const [isChanged, setIsChanged] = useState(false);
  const { player, loading } = useFetchPlayerById(playerId, isChanged);
  const { playerStats } = useFetchPlayerStatsById(playerId);
  const [isFan, setIsFan] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkIfFan = async () => {
      try {
        const res = await fetch(`/api/player/is-fan/${playerId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: currentUser?._id }),
        });
        const data = await res.json();

        setIsFan(data.isFan);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser && playerId) {
      checkIfFan();
    }
  }, [currentUser, playerId, isChanged]);

  const handleFollow = async () => {
    try {
      const res = await fetch(`/api/player/follow/${playerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser?._id }),
      });

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'You are now following this player',
        });
        setIsChanged(!isChanged);
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to follow player',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const res = await fetch(`/api/player/unfollow/${playerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser?._id }),
      });

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'You are no longer following this player',
        });
        setIsChanged(!isChanged);
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to unfollow player',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    <>
      <BackButton />
      <Separator />
      <Card className='bg-white shadow-lg rounded-lg flex flex-col'>
        <CardHeader className='bg-gray-100 p-6 flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0'>
          <div className='flex flex-col lg:flex-row items-center'>
            <div className='w-40 h-40 rounded-full mb-4 lg:mb-0 lg:mr-6'>
              <img
                src={
                  player?.imageUrl ||
                  'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
                }
                alt={`Photo of ${player?.name}`}
                className='object-cover w-full h-full rounded-full'
              />
            </div>
            <div className='text-center lg:text-left'>
              <CardTitle className='text-2xl font-bold mb-2'>
                {player?.name + ' ' + player?.surname}
              </CardTitle>
              <CardDescription className='text-gray-600'>
                {player?.position} | {player?.currentTeam}
              </CardDescription>
            </div>
          </div>
          <div className='flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-4'>
            <span className='text-gray-600 font-semibold'>
              {player?.fans?.length} fans
            </span>
            {currentUser && (
              <div className='flex space-x-2'>
                <Button
                  className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-1.5 px-4 rounded-full flex items-center transition-all duration-300 ease-in-out ${
                    isFan ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={handleFollow}
                  disabled={isFan}
                >
                  <span className='text-sm'>Follow</span>
                </Button>
                <Button
                  className={`bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-1.5 px-4 rounded-full flex items-center transition-all duration-300 ease-in-out ${
                    !isFan ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={handleUnfollow}
                  disabled={!isFan}
                >
                  <span className='text-sm'>Unfollow</span>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className='p-6 grid grid-cols-1 lg:grid-cols-2 gap-8'>
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
        <div className='p-6 grid mt-5 w-full rounded-none shadow-md'>
          <h3 className='text-lg font-semibold mb-4'>Player Stats</h3>
          <CustomDataTable
            columns={columns}
            data={playerStats}
            pending
            searchable={false}
          />
        </div>
      </Card>
    </>
  );
};

export default PlayerDetails;
