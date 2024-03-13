/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/card';

const FilledMatches = ({ matches }) => {
  return (
    <>
      {matches?.map((match) => (
        <Link
          to={`/dashboard/referee/league/result/edit/${match._id}`}
          key={match._id}
        >
          <Card className='w-full flex p-5 my-5'>
            <p>
              {match?.homeTeam?.name} vs {match?.awayTeam?.name} -{' '}
              {new Date(match.startDate).toLocaleString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </p>
          </Card>
        </Link>
      ))}
    </>
  );
};

export default FilledMatches;
