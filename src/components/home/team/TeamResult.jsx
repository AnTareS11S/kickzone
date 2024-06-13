import { Link, useParams } from 'react-router-dom';
import { Card, CardContent } from '../../ui/card';
import Spinner from '../../Spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useFetchSeasons } from '../../hooks/useFetchSeasons';

const TeamResult = () => {
  const teamId = useParams().id;
  const [results, setResults] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const seasons = useFetchSeasons();
  const [selectedSeason, setSelectedSeason] = useState('');

  useEffect(() => {
    if (seasons.length > 0) {
      const lastSeason = seasons[seasons.length - 1].split(':')[1];
      setSelectedSeason(lastSeason);
    }
  }, [seasons]);

  useEffect(() => {
    const fetchResultsData = async () => {
      try {
        const res = await fetch(
          `/api/team/results/${teamId}?season=${selectedSeason}`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch results data!');
        }
        const data = await res.json();

        setResults(data.results);
        setMatches(data.matches);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchResultsData();
  }, [teamId, selectedSeason]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className='flex justify-end items-center mb-8'>
        <div className='flex items-center space-x-2'>
          <Select
            value={selectedSeason}
            onValueChange={(value) => {
              setSelectedSeason(value);
              setLoading(true);
            }}
          >
            <SelectTrigger className='flex items-center border border-gray-300 rounded-lg px-4 py-2 hover:border-gray-500 bg-white shadow-sm'>
              <SelectValue placeholder='Select Season' />
            </SelectTrigger>
            <SelectContent>
              {seasons?.map((season, index) => (
                <SelectItem key={index} value={season?.split(':')[1]}>
                  {season?.split(':')[0]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FaRegCalendarAlt className='text-gray-500' />
        </div>
      </div>
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
