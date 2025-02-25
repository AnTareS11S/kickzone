import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
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
import CustomDataTable from '../../components/CustomDataTable';
import {
  FaFlag,
  FaRulerVertical,
  FaWeight,
  FaBirthdayCake,
  FaFutbol,
} from 'react-icons/fa';
import { useToast } from '../../components/ui/use-toast';
import { Button } from '../../components/ui/button';
import { GetPlayerById } from '../../api/getPlayerById';
import { GetPlayerStatsById } from '../../api/getPlayerStatsById';

const PlayerDetails = () => {
  const playerId = useParams().id;
  const { currentUser } = useSelector((state) => state.user);
  const [isChanged, setIsChanged] = useState(false);
  const { player, loading } = GetPlayerById(playerId, isChanged);
  const { playerStats } = GetPlayerStatsById(playerId);
  const [isFan, setIsFan] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkIfFan = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/player/is-fan/${playerId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: currentUser?._id }),
          }
        );
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
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/player/follow/${playerId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: currentUser?._id }),
        }
      );

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
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/player/unfollow/${playerId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: currentUser?._id }),
        }
      );

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
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spinner size='large' />
      </div>
    );
  }

  if (!player) {
    return (
      <div className='text-center py-12'>
        <h2 className='text-2xl font-bold text-gray-700'>Player not found</h2>
        <p className='text-gray-500 mt-2'>
          The requested player could not be found.
        </p>
        <BackButton className='mt-4' />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='container mx-auto px-4 py-8'
    >
      <BackButton />
      <Separator className='my-4' />
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='col-span-1 lg:col-span-3'>
          <Card className='bg-white shadow-lg rounded-lg overflow-hidden'>
            <CardHeader className='bg-gradient-to-r from-blue-500 to-purple-500 p-6'>
              <div className='flex flex-col lg:flex-row items-center justify-between'>
                <div className='flex flex-col lg:flex-row items-center'>
                  <img
                    src={
                      player?.imageUrl ||
                      'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
                    }
                    alt={`Photo of ${player?.name}`}
                    className='w-32 h-32 rounded-full border-4 border-white mb-4 lg:mb-0 lg:mr-6'
                  />
                  <div className='text-center lg:text-left'>
                    <CardTitle className='text-3xl font-bold text-white mb-2'>
                      {player?.name} {player?.surname}
                    </CardTitle>
                    <CardDescription className='text-white text-lg'>
                      {player?.position} | {player?.currentTeam}
                    </CardDescription>
                  </div>
                </div>
                <div className='mt-4 lg:mt-0'>
                  <span className='text-white font-semibold text-lg'>
                    {player?.fans?.length} fans
                  </span>
                  {currentUser && (
                    <div className='flex space-x-2 mt-2'>
                      <Button
                        className={`bg-white text-blue-500 hover:bg-blue-100 font-semibold py-2 px-4 rounded-full transition-all duration-300 ease-in-out ${
                          isFan ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handleFollow}
                        disabled={isFan}
                      >
                        Follow
                      </Button>
                      <Button
                        className={`bg-red-500 text-white hover:bg-red-600 font-semibold py-2 px-4 rounded-full transition-all duration-300 ease-in-out ${
                          !isFan ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handleUnfollow}
                        disabled={!isFan}
                      >
                        Unfollow
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className='col-span-1 lg:col-span-2'>
          <Card className='h-full'>
            <CardHeader>
              <CardTitle className='text-2xl font-bold'>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-2 gap-4'>
              <div className='flex items-center'>
                <FaBirthdayCake className='text-gray-500 mr-2 text-xl' />
                <p className='text-gray-700'>{player?.age} years old</p>
              </div>
              <div className='flex items-center'>
                <FaFlag className='text-gray-500 mr-2 text-xl' />
                <p className='text-gray-700'>{player?.nationality}</p>
              </div>
              <div className='flex items-center'>
                <FaRulerVertical className='text-gray-500 mr-2 text-xl' />
                <p className='text-gray-700'>{player?.height} cm</p>
              </div>
              <div className='flex items-center'>
                <FaWeight className='text-gray-500 mr-2 text-xl' />
                <p className='text-gray-700'>{player?.weight} kg</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='col-span-1'>
          <Card className='h-full'>
            <CardHeader>
              <CardTitle className='text-2xl font-bold'>
                Previous Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {player.teams?.map((team, index) => (
                  <li key={index} className='flex items-center'>
                    <FaFutbol className='text-gray-500 mr-2' />
                    <span className='text-gray-700'>{team.split(':')[0]}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className='col-span-1 lg:col-span-3'>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl font-bold'>Player Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomDataTable
                columns={columns}
                data={playerStats}
                pending={loading}
                searchable={false}
                pagination
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10, 15, 20]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerDetails;
