import { Link, useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { Separator } from '../../components/ui/separator';
import { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';

const ResultDetails = () => {
  const resultId = useParams().id;
  const [result, setResult] = useState({});
  const [match, setMatch] = useState({});
  const [homeTeamPlayersStats, setHomeTeamPlayersStats] = useState([]);
  const [awayTeamPlayersStats, setAwayTeamPlayersStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getResult = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/referee/result-details/${resultId}`
        );
        const data = await res.json();

        const filterPlayersWithStats = (playersStats) => {
          return playersStats.filter((player) =>
            player.matchStats.some(
              (stat) =>
                stat.goals > 0 ||
                stat.yellowCards > 0 ||
                stat.redCards > 0 ||
                stat.ownGoals > 0 ||
                stat.cleanSheets > 0
            )
          );
        };

        setResult(data?.result);
        setMatch(data?.match);
        setHomeTeamPlayersStats(
          filterPlayersWithStats(data?.filteredHomeTeamPlayersStats)
        );
        setAwayTeamPlayersStats(
          filterPlayersWithStats(data?.filteredAwayTeamPlayersStats)
        );
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    getResult();
  }, [resultId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <BackButton />
      <Separator className='my-6' />

      <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
        <div className='px-8 py-10'>
          {/* Header: Teams and Score */}
          <div className='flex flex-col sm:flex-row justify-between items-center text-center mb-6'>
            {/* Home Team */}
            <div className='flex items-center space-x-4 sm:space-x-8 mb-4 sm:mb-0'>
              {match?.homeTeam?.logo && (
                <img
                  src={match?.homeTeam?.logoUrl}
                  alt={`Logo of ${match?.homeTeam?.name}`}
                  className='w-20 h-20 rounded-full object-cover border-2 border-gray-300 shadow-sm'
                />
              )}
              <span className='text-2xl font-semibold text-gray-800'>
                {match?.homeTeam?.name}
              </span>
            </div>

            {/* Score */}
            <div className='text-5xl font-bold text-primary-600'>
              {result?.homeTeamScore} : {result?.awayTeamScore}
            </div>

            {/* Away Team */}
            <div className='flex items-center space-x-4 sm:space-x-8'>
              <span className='text-2xl font-semibold text-gray-800'>
                {match?.awayTeam?.name}
              </span>
              {match?.awayTeam?.logo && (
                <img
                  src={match?.awayTeam?.logoUrl}
                  alt={`Logo of ${match?.awayTeam?.name}`}
                  className='w-20 h-20 rounded-full object-cover border-2 border-gray-300 shadow-sm'
                />
              )}
            </div>
          </div>

          {/* Date and Time */}
          <p className='text-gray-600 text-center text-lg mb-10'>
            {new Date(match?.startDate).toLocaleString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </p>

          {/* Referee Information */}
          <div className='bg-gray-50 p-6 rounded-lg shadow-sm mb-8'>
            <h3 className='text-xl font-semibold text-gray-800 mb-4'>
              Match Officials
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
              {/* Main Referee */}
              <div>
                <h4 className='font-medium text-gray-700'>Main Referee:</h4>
                <Link
                  to={`/referee/${match?.mainReferee?._id}`}
                  className='text-primary-500 hover:underline'
                >
                  {match?.mainReferee?.name} {match?.mainReferee?.surname}
                </Link>
              </div>

              {/* First Assistant */}
              <div>
                <h4 className='font-medium text-gray-700'>1st Assistant:</h4>
                <Link
                  to={`/referee/${match?.firstAssistantReferee?._id}`}
                  className='text-primary-500 hover:underline'
                >
                  {match?.firstAssistantReferee?.name}{' '}
                  {match?.firstAssistantReferee?.surname}
                </Link>
              </div>

              {/* Second Assistant */}
              <div>
                <h4 className='font-medium text-gray-700'>2nd Assistant:</h4>
                <Link
                  to={`/referee/${match?.secondAssistantReferee?._id}`}
                  className='text-primary-500 hover:underline'
                >
                  {match?.secondAssistantReferee?.name}{' '}
                  {match?.secondAssistantReferee?.surname}
                </Link>
              </div>
            </div>
          </div>

          {/* Teams Players Stats */}
          <div className='flex flex-col sm:flex-row gap-8'>
            {/* Home Team Players */}
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-gray-800 mb-4'>
                Home Team Players
              </h3>
              <ul className='space-y-4'>
                {homeTeamPlayersStats?.map((player) => (
                  <li key={player._id} className='flex items-center space-x-4'>
                    <div className='flex space-x-2'>
                      {player?.matchStats.map((stat, index) => (
                        <div key={index} className='flex items-center'>
                          {Array.from({ length: stat.goals }).map((_, i) => (
                            <img
                              key={i}
                              src='/football.png'
                              alt='Goal'
                              className='w-6 h-6'
                            />
                          ))}
                          {Array.from({ length: stat.yellowCards }).map(
                            (_, i) => (
                              <img
                                key={i}
                                src='/yellow-card.png'
                                alt='Yellow Card'
                                className='w-6 h-6'
                              />
                            )
                          )}
                          {Array.from({ length: stat.redCards }).map((_, i) => (
                            <img
                              key={i}
                              src='/red-card.png'
                              alt='Red Card'
                              className='w-6 h-6'
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    <span className='text-gray-800'>
                      {player?.player?.name} {player?.player?.surname}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Away Team Players */}
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-gray-800 mb-4'>
                Away Team Players
              </h3>
              <ul className='space-y-4'>
                {awayTeamPlayersStats?.map((player) => (
                  <li key={player._id} className='flex items-center space-x-4'>
                    <div className='flex space-x-2'>
                      {player?.matchStats.map((stat, index) => (
                        <div key={index} className='flex items-center'>
                          {Array.from({ length: stat.goals }).map((_, i) => (
                            <img
                              key={i}
                              src='/football.png'
                              alt='Goal'
                              className='w-6 h-6'
                            />
                          ))}
                          {Array.from({ length: stat.yellowCards }).map(
                            (_, i) => (
                              <img
                                key={i}
                                src='/yellow-card.png'
                                alt='Yellow Card'
                                className='w-6 h-6'
                              />
                            )
                          )}
                          {Array.from({ length: stat.redCards }).map((_, i) => (
                            <img
                              key={i}
                              src='/red-card.png'
                              alt='Red Card'
                              className='w-6 h-6'
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    <span className='text-gray-800'>
                      {player?.player?.name} {player?.player?.surname}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDetails;
