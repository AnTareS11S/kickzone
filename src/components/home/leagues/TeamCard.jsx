/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../ui/card';

const TeamCard = ({ data }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
      {data.map((team) => (
        <Link key={team._id} to={`/leagues/team/${team._id}`}>
          <Card className='flex flex-col'>
            <img
              src={team.logo}
              alt={`Logo of ${team.name}`}
              className='object-contain w-full h-32'
            />
            <CardContent className='flex-grow flex flex-col justify-between'>
              <h3 className='text-heading3-bold text-center'>{team.name}</h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default TeamCard;
