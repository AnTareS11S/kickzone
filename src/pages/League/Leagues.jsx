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
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className='text-heading2-bold mb-4'>Leagues</div>
      <Separator />
      <section className='mt-9 gap-10'>
        <LeagueCard data={leagues} />
      </section>
    </>
  );
};

export default Leagues;
