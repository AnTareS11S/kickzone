import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/ui/card';
import { useEffect, useState } from 'react';
import { Separator } from '../../components/ui/separator';

const LeagueScheduleCard = () => {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    const getLeagues = async () => {
      try {
        const res = await fetch('/api/admin/league');
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
      <div className='text-heading2-bold mb-4'>Dashboard</div>
      <p className='text-sm text-muted-foreground mb-4'>
        Choose a league you want to manage
      </p>

      <Separator />
      <article className='flex flex-wrap gap-7 mt-9'>
        {leagues.map((league) => (
          <Card key={league._id} className='w-[250px] h-[100px] max-sm:w-full'>
            <Link to={`/dashboard/referee/league/${league._id}`}>
              <CardHeader className='items-center pt-10'>
                <CardTitle>{league.name}</CardTitle>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </article>
    </>
  );
};

export default LeagueScheduleCard;
