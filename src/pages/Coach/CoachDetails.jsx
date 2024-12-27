import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import Spinner from '../../components/Spinner';
import { useParams } from 'react-router-dom';
import { useFetchCoachById } from '../../components/hooks/useFetchCoachById';
import BackButton from '../../components/BackButton';
import { Separator } from '../../components/ui/separator';
import {
  FaFlag,
  FaCity,
  FaBirthdayCake,
  FaTrophy,
  FaFutbol,
  FaEquals,
} from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { useState, useEffect } from 'react';

const StatCard = ({ title, value, icon: Icon }) => (
  <div className='bg-white rounded-lg p-4 shadow-md flex items-center space-x-4'>
    <div className='p-3 bg-blue-50 rounded-full'>
      <Icon className='w-6 h-6 text-blue-500' />
    </div>
    <div>
      <p className='text-sm text-gray-500'>{title}</p>
      <p className='text-2xl font-bold text-gray-800'>{value}</p>
    </div>
  </div>
);

const CoachDetails = () => {
  const coachId = useParams().id;
  const { coach, loading } = useFetchCoachById(coachId);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchCoachStats = async () => {
      try {
        if (coach?.currentTeam) {
          const res = await fetch(
            `/api/coach/coach-stats/${coachId}/${coach.currentTeamId}`
          );
          const data = await res.json();
          console.log(data);
          setStats(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCoachStats();
  }, [coachId, coach]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <article className='py-8 space-y-6'>
      <BackButton />
      <Separator />

      {/* Profile Card */}
      <Card className='bg-white shadow-lg rounded-lg'>
        <CardHeader className='bg-gray-100 p-6 flex flex-col md:flex-row items-center'>
          <div className='w-40 h-40 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6'>
            <img
              src={
                coach?.imageUrl ||
                'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
              }
              alt={`Photo of ${coach?.name}`}
              className='object-cover w-full h-full'
            />
          </div>
          <div>
            <CardTitle className='text-2xl font-bold mb-2'>
              {coach?.name} {coach?.surname}
            </CardTitle>
            <CardDescription className='text-gray-600'>
              {coach?.bio} | {coach?.currentTeam}
            </CardDescription>
          </div>
        </CardHeader>

        {/* Stats Grid */}
        {stats && (
          <div className='p-6 border-b'>
            <h3 className='text-lg font-semibold mb-4'>
              Current Team Statistics
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <StatCard
                title='Total Matches'
                value={stats.matches}
                icon={FaFutbol}
              />
              <StatCard title='Wins' value={stats.wins} icon={FaTrophy} />
              <StatCard title='Draws' value={stats.draws} icon={FaEquals} />
              <StatCard title='Losses' value={stats.losses} icon={IoMdClose} />
            </div>
            <div className='mt-4 bg-blue-50 p-4 rounded-lg'>
              <p className='text-blue-800 text-sm'>
                Win Rate:{' '}
                {stats.matches
                  ? ((stats.wins / stats.matches) * 100).toFixed(1)
                  : 0}
                %
              </p>
            </div>
          </div>
        )}

        {/* Personal Info and Previous Teams */}
        <CardContent className='p-6 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Personal Information</h3>
            <div className='space-y-3'>
              <div className='flex items-center'>
                <FaBirthdayCake className='text-gray-500 mr-3 w-5 h-5' />
                <p className='text-gray-700'>
                  {coach.birthDate?.toString().slice(0, 10)}
                </p>
              </div>
              <div className='flex items-center'>
                <FaFlag className='text-gray-500 mr-3 w-5 h-5' />
                <p className='text-gray-700'>{coach?.nationality}</p>
              </div>
              <div className='flex items-center'>
                <FaCity className='text-gray-500 mr-3 w-5 h-5' />
                <p className='text-gray-700'>{coach?.city}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Previous Teams</h3>
            <ul className='space-y-2'>
              {coach.teams?.map((team, index) => (
                <li key={index} className='flex items-center'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full mr-3'></div>
                  <span className='text-gray-700'>{team.split(':')[0]}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </article>
  );
};

export default CoachDetails;
