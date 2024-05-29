import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '../../ui/card';
import { useFetchResultsAndMatchesByTeamId } from '../../hooks/useFetchResultsAndMatchesByTeamId';
import Spinner from '../../Spinner';

const TeamResult = () => {
  const teamId = useLocation().pathname.split('/').pop();
  const { results, matches, loading } =
    useFetchResultsAndMatchesByTeamId(teamId);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      {matches?.length > 0 ? (
        <Card className='mb-5 mt-5'>
          <CardContent className='p-6'>
            {matches?.map((match) => (
              <div
                key={match?._id}
                className='border cursor-pointer p-4 rounded-md hover:shadow-md transition-all mb-4 hover:bg-gray-200 '
              >
                {results
                  .filter((result) => result.match === match._id)
                  .map((result) => (
                    <Link to={`/results/${result?._id}`} key={result?._id}>
                      <div className='flex items-center justify-between p-2 rounded-md transition-all'>
                        <div className='flex items-center space-x-4'>
                          <p
                            className='text-sm text-gray-800 font-semibold'
                            key={result?._id}
                          >
                            {match?.homeTeam?.name} {result?.homeTeamScore} :{' '}
                            {result?.awayTeamScore} {match?.awayTeam?.name}
                          </p>
                        </div>
                        <div className='flex items-center space-x-4'>
                          <p className='text-sm text-gray-500'>
                            {new Date(match?.startDate).toLocaleDateString(
                              'en-GB',
                              {
                                day: 'numeric',
                                month: 'long',
                              }
                            )}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {new Date(match?.startDate).toLocaleTimeString(
                              'en-GB',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <div className='flex items-center justify-center h-full'>
          <p className='text-gray-600'>No results found.</p>
        </div>
      )}
    </>
  );
};

export default TeamResult;
