import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../../Spinner';
import { useFetchSeasons } from '../../hooks/useFetchSeasons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { FaRegCalendarAlt } from 'react-icons/fa';

const TeamMatches = () => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const seasons = useFetchSeasons();
  const [selectedSeason, setSelectedSeason] = useState('');
  const teamId = useParams().id;

  useEffect(() => {
    if (seasons.length > 0) {
      const lastSeason = seasons[seasons.length - 1].split(':')[1];
      setSelectedSeason(lastSeason);
    }
  }, [seasons]);

  useEffect(() => {
    const getMatches = async () => {
      try {
        const res = await fetch(
          `/api/team/matches/${teamId}?season=${selectedSeason}`
        );
        const data = await res.json();
        setMatches(data);
        setFilteredMatches(data.matches);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    getMatches();
  }, [teamId, selectedSeason]);

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
      {filteredMatches.length ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {filteredMatches.map((match) => (
            <div
              key={match._id}
              className='bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105'
            >
              <div className='p-6'>
                <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                  {match.round.name}
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
                  Opponent: {match.opponent.name}
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
