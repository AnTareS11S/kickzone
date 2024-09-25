import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../ui/card';

const MatchCard = ({ match, isPlayed }) => (
  <Card className='mb-4 hover:shadow-lg transition-shadow duration-300'>
    <CardContent className='p-4'>
      <Link
        to={
          isPlayed ? `/results/${match?.resultId}` : `/match/${match?.matchId}`
        }
        className='block'
      >
        <div className='flex justify-between items-center mb-2'>
          <span className='text-sm text-gray-500'>{match.league}</span>
          <span className='text-sm font-semibold'>
            <span className='flex items-center'>
              <span className='mr-1 text-blue-500'>&#128337;</span>
              {new Date(match?.startDate).toLocaleString('en-UK', {
                hour: 'numeric',
                minute: 'numeric',
              })}
            </span>
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='font-semibold'>{match.homeTeam}</span>
          <span className='text-lg font-bold'>
            {isPlayed ? `${match?.homeScore} : ${match?.awayScore}` : 'vs'}
          </span>
          <span className='font-semibold'>{match.awayTeam}</span>
        </div>
      </Link>
    </CardContent>
  </Card>
);

export default MatchCard;
