import { useEffect, useState } from 'react';
import LeagueCard from '../../components/home/leagues/LeagueCard';
import { Separator } from '../../components/ui/separator';
import Spinner from '../../components/Spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { useFetchSeasons } from '../../components/hooks/useFetchSeasons';

const Leagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const seasons = useFetchSeasons();
  const [selectedSeason, setSelectedSeason] = useState('');

  useEffect(() => {
    if (seasons.length > 0) {
      const lastSeason = seasons[seasons.length - 1].split(':')[1];
      setSelectedSeason(lastSeason);
    }
  }, [seasons]);

  useEffect(() => {
    const getLeagues = async () => {
      try {
        const res = await fetch(`/api/admin/league?season=${selectedSeason}`);
        const data = await res.json();
        setLeagues(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    if (selectedSeason) {
      getLeagues();
    }
  }, [selectedSeason]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Leagues</h1>
        <div className='flex items-center'>
          <Select
            value={selectedSeason}
            onValueChange={(value) => {
              setSelectedSeason(value);
              setLoading(true);
            }}
            className='mr-2'
          >
            <SelectTrigger className='inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
              <SelectValue placeholder='Select Season' />
              <FaRegCalendarAlt className='ml-2 text-gray-400' />
            </SelectTrigger>
            <SelectContent>
              {seasons?.map((season, index) => (
                <SelectItem key={index} value={season?.split(':')[1]}>
                  {season?.split(':')[0]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator />
      <div className='mt-6'>
        <LeagueCard data={leagues} />
      </div>
    </div>
  );
};

export default Leagues;
