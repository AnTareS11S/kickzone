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
import { FaRegCalendarAlt, FaTrophy } from 'react-icons/fa';
import { useFetchSeasons } from '../../components/hooks/useFetchSeasons';
import { motion } from 'framer-motion';

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
    <div className='container mx-auto px-4 py-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-white rounded-lg shadow-lg p-6 md:p-8'
      >
        <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center'>
            <FaTrophy className='mr-3 text-yellow-500' />
            Leagues
          </h1>
          <div className='w-full md:w-auto'>
            <Select
              value={selectedSeason}
              onValueChange={(value) => setSelectedSeason(value)}
            >
              <SelectTrigger className='w-full md:w-full inline-flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
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
        <Separator className='my-6' />
        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <Spinner />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='grid grid-cols-1 gap-6'
          >
            {leagues.length > 0 ? (
              <LeagueCard data={leagues} />
            ) : (
              <p className='text-gray-500 text-center col-span-full'>
                No leagues found for the selected season.
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Leagues;
