import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '../../ui/card';

const TeamResult = () => {
  const teamId = useLocation().pathname.split('/').pop();
  const [results, setResults] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const getResults = async () => {
      try {
        const res = await fetch(`/api/team/results/${teamId}`);
        const data = await res.json();
        setResults(data.results);
        setMatches(data.matches);
      } catch (error) {
        console.log(error);
      }
    };

    getResults();
  }, [teamId]);

  return (
    <Card className='mb-5 mt-5'>
      <CardContent className='p-6'>
        {matches?.map((match) => (
          <Link to={`/results/${match?._id}`} key={match?._id}>
            <div className='border cursor-pointer p-4 rounded-md hover:shadow-md transition-all mb-4 hover:bg-gray-200 '>
              <div className='flex items-center justify-between p-2 rounded-md transition-all'>
                <div className='flex items-center space-x-4'>
                  {results?.map((result) => (
                    <p
                      className='text-sm text-gray-800 font-semibold'
                      key={result?._id}
                    >
                      {match?.homeTeam?.name} {result?.homeTeamScore} :{' '}
                      {result?.awayTeamScore} {match?.awayTeam?.name}
                    </p>
                  ))}
                </div>
                <div className='flex items-center space-x-4'>
                  <p className='text-sm text-gray-500'>
                    {new Date(match?.startDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {new Date(match?.startDate).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default TeamResult;
