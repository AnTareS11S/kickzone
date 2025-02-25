import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/ui/card';
import { useEffect, useState } from 'react';
import { Separator } from '../../components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { FaRegCalendarAlt } from 'react-icons/fa';
import Spinner from '../../components/Spinner';
import { GetSeasons } from '../../api/getSeasons';

const LeagueScheduleCard = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const seasons = GetSeasons();
  const [selectedSeason, setSelectedSeason] = useState('');

  useEffect(() => {
    if (seasons.length > 0) {
      const lastSeason = seasons[seasons.length - 1]?.id;
      console.log(lastSeason);
      setSelectedSeason(lastSeason);
    }
  }, [seasons]);

  useEffect(() => {
    const getLeagues = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/admin/league?season=${selectedSeason}`
        );
        if (!res.ok) throw new Error('Failed to fetch leagues');
        const data = await res.json();
        setLeagues(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError('Failed to load leagues. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (selectedSeason) {
      getLeagues();
    }
  }, [selectedSeason]);

  return (
    <div className='p-4'>
      <div className='text-heading4-medium mb-4'>Dashboard</div>
      <p className='text-sm text-muted-foreground mb-4'>
        Choose a league you want to manage
      </p>
      <div className='flex items-center mb-4'>
        <Select
          value={selectedSeason}
          onValueChange={(value) => {
            setSelectedSeason(value);
            setError(null);
          }}
          className='mr-2'
        >
          <SelectTrigger className='inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
            <SelectValue placeholder='Select Season' />
            <FaRegCalendarAlt className='ml-2 text-gray-400' />
          </SelectTrigger>
          <SelectContent>
            {seasons
              ?.filter((season) => season?.id)
              .map((season, index) => (
                <SelectItem key={index} value={season?.id}>
                  {season?.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <Separator />

      {loading && <Spinner className='mt-6' />}
      {error && <p className='text-red-500 mt-6'>{error}</p>}

      {!loading && !error && (
        <article className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6'>
          {leagues.map((league) => (
            <Card
              key={league._id}
              className='w-full h-[100px] hover:bg-purple-200 transition duration-300 ease-in-out'
            >
              <Link to={`/dashboard/referee/league/${league._id}`}>
                <CardHeader className='flex items-center justify-center h-full'>
                  <CardTitle>{league.name}</CardTitle>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </article>
      )}
    </div>
  );
};

export default LeagueScheduleCard;
