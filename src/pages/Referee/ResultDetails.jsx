import { Link, useLocation } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { Separator } from '../../components/ui/separator';
import { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';

const ResultDetails = () => {
  const resultId = useLocation().pathname.split('/').pop();
  const [result, setResult] = useState({});
  const [match, setMatch] = useState({});
  const [homeTeamPlayersStats, setHomeTeamPlayersStats] = useState([]);
  const [awayTeamPlayersStats, setAwayTeamPlayersStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getResult = async () => {
      try {
        const res = await fetch(`/api/referee/result-details/${resultId}`);
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
      } finally {
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
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='px-6 py-8 sm:px-8 sm:py-10'>
          <div className='flex flex-col sm:flex-row justify-between items-center text-center mb-6'>
            <div className='flex items-center space-x-4 sm:space-x-20 mb-4 sm:mb-0'>
              {match?.homeTeam?.logo && (
                <img
                  src={match?.homeTeam?.logoUrl}
                  alt={`Logo of ${match?.homeTeam?.name}`}
                  className='w-16 h-16 rounded-md object-cover'
                />
              )}
              <span className='text-2xl font-bold text-gray-800'>
                {match?.homeTeam?.name}
              </span>
            </div>
            <div className='text-4xl font-bold text-gray-800'>
              {result?.homeTeamScore} : {result?.awayTeamScore}
            </div>
            <div className='flex items-center space-x-4 sm:space-x-20'>
              <span className='text-2xl font-bold text-gray-800'>
                {match?.awayTeam?.name}
              </span>
              {match?.awayTeam?.logo && (
                <img
                  src={match?.awayTeam?.logoUrl}
                  alt={`Logo of ${match?.awayTeam?.name}`}
                  className='w-16 h-16 rounded-md object-cover'
                />
              )}
            </div>
          </div>
          <p className='text-gray-600 text-center mb-8'>
            {new Date(match?.startDate).toLocaleString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </p>
          <div>
            <h3 className='text-xl font-semibold text-gray-800 mb-4'>
              Main Referee
            </h3>
            <Link
              to={`/referee/${match?.mainReferee?._id}`}
              className='text-gray-800 hover:text-primary-500 transition-colors'
            >
              {match?.mainReferee?.name} {match?.mainReferee?.surname}
            </Link>

            <div className='flex items-center mt-4'>
              <h3 className='text-xl font-semibold text-gray-800 mr-4'>
                Assistant Referees
              </h3>
              <div>
                <div className='flex items-center'>
                  <h4 className='text-gray-800 mr-2'>1st:</h4>
                  <Link
                    to={`/referee/${match?.firstAssistantReferee?._id}`}
                    className='text-gray-800 hover:text-primary-500 transition-colors'
                  >
                    {match?.firstAssistantReferee?.name}
                    {match?.firstAssistantReferee?.surname}
                  </Link>
                </div>
                <div className='flex items-center mt-2'>
                  <h4 className='text-gray-800 mr-2'>2nd:</h4>
                  <Link
                    to={`/referee/${match?.secondAssistantReferee?._id}`}
                    className='text-gray-800 hover:text-primary-500 transition-colors'
                  >
                    {match?.secondAssistantReferee?.name}
                    {match?.secondAssistantReferee?.surname}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Separator className='mb-8' />
          <div className='flex flex-col sm:flex-row justify-center'>
            {/* Home Team Players */}
            <div className='w-full sm:w-1/2 mb-8 sm:mb-0'>
              <h3 className='text-xl font-semibold text-gray-800 mb-4'>
                Home Team Players
              </h3>
              <ul>
                {homeTeamPlayersStats?.map((player) => (
                  <li key={player._id} className='flex items-center mb-4'>
                    <div className='flex items-center'>
                      {player?.matchStats
                        .map((stat) =>
                          Array.from({ length: stat.goals }, (_, i) => i)
                        )
                        .flat()
                        .map((index) => (
                          <img
                            key={index}
                            src='/football.png'
                            alt='football'
                            className='w-5 h-5 mr-2'
                          />
                        ))}
                      {player?.matchStats
                        .map((stat) =>
                          Array.from({ length: stat.yellowCards }, (_, i) => i)
                        )
                        .flat()
                        .map((index) => (
                          <img
                            key={index}
                            src='/yellow-card.png'
                            alt='yellowCard'
                            className='w-5 h-5 mr-2'
                          />
                        ))}
                      {player?.matchStats
                        .map((stat) =>
                          Array.from({ length: stat.redCards }, (_, i) => i)
                        )
                        .flat()
                        .map((index) => (
                          <img
                            key={index}
                            src='/red-card.png'
                            alt='redCards'
                            className='w-5 h-5 mr-2'
                          />
                        ))}
                    </div>
                    <span className='text-gray-800 ml-4'>
                      {player.player?.name} {player?.player?.surname}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Separator */}
            <div className='hidden sm:block w-1/12'>
              <Separator orientation='vertical' className='h-full' />
            </div>

            {/* Away Team Players */}
            <div className='w-full sm:w-1/2'>
              <h3 className='text-xl font-semibold text-gray-800 mb-4'>
                Away Team Players
              </h3>
              <ul>
                {awayTeamPlayersStats.map((player) => (
                  <li key={player._id} className='flex items-center mb-4'>
                    <div className='flex items-center'>
                      {player?.matchStats
                        .map((stat) =>
                          Array.from({ length: stat.goals }, (_, i) => i)
                        )
                        .flat()
                        .map((index) => (
                          <img
                            key={index}
                            src='/football.png'
                            alt='football'
                            className='w-5 h-5 mr-2'
                          />
                        ))}
                      {player?.matchStats
                        .map((stat) =>
                          Array.from({ length: stat.yellowCards }, (_, i) => i)
                        )
                        .flat()
                        .map((index) => (
                          <img
                            key={index}
                            src='/yellow-card.png'
                            alt='yellowCard'
                            className='w-5 h-5 mr-2'
                          />
                        ))}
                      {player?.matchStats
                        .map((stat) =>
                          Array.from({ length: stat.redCards }, (_, i) => i)
                        )
                        .flat()
                        .map((index) => (
                          <img
                            key={index}
                            src='/red-card.png'
                            alt='redCards'
                            className='w-5 h-5 mr-2'
                          />
                        ))}
                    </div>
                    <span className='text-gray-800 ml-4'>
                      {player.player?.name} {player?.player?.surname}
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
