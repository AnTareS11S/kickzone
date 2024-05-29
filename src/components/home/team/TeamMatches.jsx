import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../../Spinner';

const TeamMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const teamId = useParams().id;

  useEffect(() => {
    const getMatches = async () => {
      try {
        const res = await fetch(`/api/team/matches/${teamId}`);
        const data = await res.json();
        setMatches(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    getMatches();
  }, [teamId]);

  const setOpponentsInMatches = () => {
    if (matches.matches && matches.teamOpponents) {
      matches.matches.forEach((match, index) => {
        match.opponent = matches.teamOpponents[index];
      });
    }
  };

  setOpponentsInMatches();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      {matches?.matches?.length ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {matches?.matches?.map((match) => (
            <div
              key={match?._id}
              className='bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg'
            >
              <div className='p-6'>
                <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                  {match?.round?.name}
                </h2>
                <p className='text-gray-600 mb-2'>
                  Date:{' '}
                  {new Date(match.startDate).toLocaleString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </p>
                <p className='text-gray-600 mb-2'>
                  Opponent: {match?.opponent?.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-2xl text-gray-500 mx-auto text-center'>
          No matches found
        </p>
      )}
    </div>
  );
};

export default TeamMatches;
