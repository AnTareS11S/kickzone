import { useEffect, useState } from 'react';
import { useFetchPlayerByUserId } from '../../components/hooks/useFetchPlayerByUserId';
import Spinner from '../../components/Spinner';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { FaCalendar, FaClock } from 'react-icons/fa';
import PageHeader from '../../components/PageHeader';

const PlayerSchedule = () => {
  const { player } = useFetchPlayerByUserId();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMatches = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/team/matches/${player?.currentTeam?._id}`
        );
        const data = await res.json();
        setMatches(data?.matches);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getMatches();
  }, [player?.currentTeam]);

  if (loading) {
    return <Spinner />;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <PageHeader title='Matches' description='Upcoming matches' />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-3 gap-4'>
        {matches?.map((match) => (
          <Card
            key={match._id}
            className='hover:shadow-lg transition-shadow duration-200'
          >
            <CardHeader className='bg-gray-50 dark:bg-gray-800'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-medium text-gray-500'>
                  {match.league.name}
                </span>
                <span className='text-sm font-medium text-gray-500'>
                  {match.round.name}
                </span>
              </div>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='space-y-4'>
                {/* Teams */}
                <div className='flex flex-col items-center space-y-2'>
                  <div className='text-lg font-semibold text-center'>
                    {match.homeTeam.name}
                  </div>
                  <div className='text-sm text-gray-500'>vs</div>
                  <div className='text-lg font-semibold text-center'>
                    {match.awayTeam.name}
                  </div>
                </div>

                {/* Date & Time */}
                <div className='space-y-2'>
                  <div className='flex items-center text-sm text-gray-600'>
                    <FaCalendar className='w-4 h-4 mr-2' />
                    {formatDate(match.startDate)}
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <FaClock className='w-4 h-4 mr-2' />
                    {formatTime(match.startDate)} - {formatTime(match.endDate)}
                  </div>
                </div>

                {/* Match Status */}
                <div className='flex items-center justify-center'>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      match.isCompleted
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {match.isCompleted ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlayerSchedule;
