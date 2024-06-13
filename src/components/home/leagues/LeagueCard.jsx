import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../ui/card';

const LeagueCard = ({ data }) => {
  return (
    <article className='flex flex-wrap gap-7'>
      {data.map((league) => (
        <Card
          key={league._id}
          className='w-[250px] h-[100px] max-sm:w-full hover:bg-purple-200 transition duration-300 ease-in-out'
        >
          <Link to={`/league/${league._id}`}>
            <CardHeader className='items-center pt-10'>
              <CardTitle>{league.name}</CardTitle>
            </CardHeader>
          </Link>
        </Card>
      ))}
    </article>
  );
};

export default LeagueCard;
