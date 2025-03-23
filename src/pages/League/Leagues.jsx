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
import { FaRegCalendarAlt, FaTrophy, FaPlusCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { GetSeasons } from '../../api/getSeasons';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import TeamRequestForm from '../../components/home/team/TeamRequestForm';
import { GetCountries } from '../../api/getCountries';

const Leagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const seasons = GetSeasons();
  const countries = GetCountries();
  const [selectedSeason, setSelectedSeason] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (seasons.length > 0) {
      const lastSeason = seasons[seasons.length - 1].id;
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
          <div className='flex flex-col md:flex-row gap-3 items-center w-full md:w-auto'>
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
                  <SelectItem key={index} value={season?.id}>
                    {season?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Team Request Button and Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className='bg-primary-500 hover:bg-purple-500 text-white flex items-center gap-2'>
                  <FaPlusCircle />
                  Request Team
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[825px] mx-auto backdrop-blur-sm bg-white/95 max-h-[80vh] overflow-y-auto p-6'>
                <DialogHeader>
                  <DialogTitle>Request a New Team</DialogTitle>
                  <DialogDescription>
                    Fill out this form to request adding a team to our platform.
                  </DialogDescription>
                </DialogHeader>
                <TeamRequestForm
                  onSuccess={() => setIsDialogOpen(false)}
                  countries={countries}
                />
              </DialogContent>
            </Dialog>
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
