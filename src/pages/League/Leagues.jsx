import { useEffect, useState } from 'react';
import LeagueCard from '../../components/home/leagues/LeagueCard';

const Leagues = () => {
  const [leagues, setLeagues] = useState([]);
  useEffect(() => {
    const getLeagues = async () => {
      try {
        const res = await fetch('/api/admin/leagues');
        const data = await res.json();
        setLeagues(data);
      } catch (error) {
        console.log(error);
      }
    };
    getLeagues();
  }, []);

  return (
    <>
      <h1 className='head-text text-dark-2 text-left'>Leagues</h1>
      <section className='mt-9 gap-10'>
        <LeagueCard data={leagues} />
      </section>
    </>
  );
};

export default Leagues;
