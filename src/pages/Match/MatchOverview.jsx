import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { FaRegClock, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { Separator } from '../../components/ui/separator';
import Spinner from '../../components/Spinner';

const MatchOverview = () => {
  const matchId = useParams().id;
  const [match, setMatch] = useState([]);
  const [loading, setLoading] = useState(true);

  // zrobic zeby pod spodem bylo W/L/D

  useEffect(() => {
    const fetchMatchOverview = async () => {
      try {
        const res = await fetch(`/api/match/overview/${matchId}`);

        if (!res.ok) {
          throw new Error('Failed to fetch match overview');
        }

        const data = await res.json();
        setMatch(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchOverview();
  }, [matchId]);

  if (loading) return <Spinner />;

  return (
    <>
      <BackButton />
      <Separator />
      <Card className='w-full max-w-8xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden'>
        <CardHeader className='bg-gradient-to-r from-primary-500 to-purple-500 text-white p-6'>
          <div className='flex justify-between items-center'>
            <CardTitle className='text-2xl font-bold'>
              {match?.league}
            </CardTitle>
            <Badge variant='secondary' className='text-sm hover:bg-slate-100'>
              {match?.season}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
            <TeamDisplay team={match?.homeTeam} isHome={true} />
            <div className='text-4xl font-bold my-4 md:my-0'>VS</div>
            <TeamDisplay team={match?.awayTeam} isHome={false} />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600'>
            <InfoItem
              icon={FaRegClock}
              label='Date & Time'
              value={new Date(match?.startDate).toLocaleString('en-UK', {
                hour: 'numeric',
                minute: 'numeric',
                day: 'numeric',
                month: 'short',
              })}
            />
            <InfoItem
              icon={FaMapMarkerAlt}
              label='Venue'
              value={match.homeTeam?.stadium?.name}
            />
            <InfoItem
              icon={FaUser}
              label='Referee'
              value={match?.mainReferee ?? 'Not assigned'}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const TeamDisplay = ({ team, isHome }) => (
  <div
    className={`flex flex-col items-center ${
      isHome ? 'md:items-end' : 'md:items-start'
    }`}
  >
    <img
      src={team?.logoUrl}
      alt={`${team?.name} logo`}
      className='w-16 h-16 mb-2'
    />
    <h2 className='text-xl font-semibold'>{team?.name}</h2>
  </div>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className='flex items-center space-x-2'>
    <Icon className='text-primary-500' />
    <div>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='font-medium'>{value}</p>
    </div>
  </div>
);

export default MatchOverview;
