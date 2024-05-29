import { useEffect, useState } from 'react';
import LeagueCard from '../../components/home/leagues/LeagueCard';
import { Separator } from '../../components/ui/separator';
import Spinner from '../../components/Spinner';

const Leagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLeagues = async () => {
      try {
        const res = await fetch('/api/admin/league');
        const data = await res.json();
        setLeagues(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getLeagues();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className='flex flex-col gap-6 p-4 md:p-8'>
        <div className='flex flex-row items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-800 mr-2'>Leagues</h1>
          <Separator />
        </div>
        <div>
          <LeagueCard data={leagues} />
        </div>
      </div>
    </>
  );
};

export default Leagues;
