import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../ui/card';
import { useLocation } from 'react-router-dom';

const PlayerStats = () => {
  const pathname = useLocation().pathname.split('/')[4];
  return (
    <>
      <article className='flex flex-wrap gap-7 mt-9'>
        <Card className='w-[250px] h-[100px] max-sm:w-full'>
          <Link to={`/dashboard/referee/league/player-stats/${pathname}`}>
            <CardHeader className='items-center pt-10'>
              <CardTitle>PlayerStats</CardTitle>
            </CardHeader>
          </Link>
        </Card>
      </article>
    </>
  );
};

export default PlayerStats;
