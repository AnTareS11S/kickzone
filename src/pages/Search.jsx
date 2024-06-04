import { useEffect, useState } from 'react';
import { Input } from '../components/ui/input';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Button } from '../components/ui/button';

const Search = () => {
  const [search, setSearch] = useState(
    localStorage.getItem('lastSearch') || ''
  );

  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/player?q=${search}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (search) {
      handleSearch();
    } else {
      setSearchResults({});
    }

    // Save the current search value to localStorage
    localStorage.setItem('lastSearch', search);

    const timeoutId = setTimeout(() => {
      localStorage.removeItem('lastSearch');
    }, 60000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch('');
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='flex items-center bg-white rounded-md shadow-sm'>
        <FaSearch className='text-gray-500 ml-4' />
        <Input
          id='text'
          value={search}
          onChange={handleChange}
          autoComplete='off'
          placeholder='Search...'
          className='flex-grow py-2 px-4 border-none bg-transparent focus-visible:outline-none focus-visible:ring-0'
        />
        {search && (
          <Button
            onClick={clearSearch}
            className='focus:outline-none shadow-none bg-0 hover:bg-0'
          >
            <FaTimes className='text-gray-500 mx-2 cursor-pointer' />
          </Button>
        )}
      </div>

      {isLoading && (
        <div className='my-8 text-center'>
          <p className='text-gray-500'>Loading...</p>
        </div>
      )}

      {!isLoading && search && searchResults?.players?.length > 0 && (
        <div className='my-8'>
          <h3 className='text-lg font-bold mb-4'>Players</h3>
          <Separator className='mb-4' />
          {searchResults.players.map((player) => (
            <Card
              key={player._id}
              className='bg-white rounded-md shadow-sm mb-4 hover:shadow-md transition-shadow duration-300'
            >
              <Link
                to={`/player/${player._id}`}
                className='flex items-center p-4'
              >
                <img
                  src={
                    player.imageUrl ||
                    'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
                  }
                  alt={player.name}
                  className='rounded-full w-12 h-12 object-cover mr-4'
                />
                <div className='flex-grow'>
                  <h4 className='text-base font-semibold'>
                    {player.name} {player.surname}
                  </h4>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && search && searchResults?.coaches?.length > 0 && (
        <div className='my-8'>
          <h3 className='text-lg font-bold mb-4'>Coches</h3>
          <Separator className='mb-4' />
          {searchResults.coaches?.map((coach) => (
            <Card
              key={coach._id}
              className='bg-white rounded-md shadow-sm mb-4 hover:shadow-md transition-shadow duration-300'
            >
              <Link
                to={`/coach/${coach._id}`}
                className='flex items-center p-4'
              >
                <img
                  src={
                    coach.imageUrl ||
                    'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
                  }
                  alt={coach.name}
                  className='rounded-full w-12 h-12 object-cover mr-4'
                />
                <div className='flex-grow'>
                  <h4 className='text-base font-semibold'>
                    {coach.name} {coach.surname}
                  </h4>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
      {!isLoading && search && searchResults?.referees?.length > 0 && (
        <div className='my-8'>
          <h3 className='text-lg font-bold mb-4'>Referees</h3>
          <Separator className='mb-4' />
          {searchResults.referees?.map((referee) => (
            <Card
              key={referee._id}
              className='bg-white rounded-md shadow-sm mb-4 hover:shadow-md transition-shadow duration-300'
            >
              <Link
                to={`/referee/${referee._id}`}
                className='flex items-center p-4'
              >
                <img
                  src={
                    referee.imageUrl ||
                    'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
                  }
                  alt={referee.name}
                  className='rounded-full w-12 h-12 object-cover mr-4'
                />
                <div className='flex-grow'>
                  <h4 className='text-base font-semibold'>
                    {referee.name} {referee.surname}
                  </h4>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
      {!isLoading && search && searchResults?.teams?.length > 0 && (
        <div className='my-8'>
          <h3 className='text-lg font-bold mb-4'>Teams</h3>
          <Separator className='mb-4' />
          {searchResults.teams?.map((team) => (
            <Card
              key={team._id}
              className='bg-white rounded-md shadow-sm mb-4 hover:shadow-md transition-shadow duration-300'
            >
              <Link
                to={`/league/team/${team._id}`}
                className='flex items-center p-4'
              >
                <img
                  src={
                    team.logoUrl ||
                    'https://d3awt09vrts30h.cloudfront.net/team_img_default.png'
                  }
                  alt={team.name}
                  className='rounded-full w-12 h-12 object-cover mr-4'
                />
                <div className='flex-grow'>
                  <h4 className='text-base font-semibold'>{team.name}</h4>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}

      {!isLoading &&
        search &&
        !searchResults.players?.length &&
        !searchResults.coaches?.length &&
        !searchResults.referees?.length &&
        !searchResults.teams?.length && (
          <div className='my-8 text-center'>
            <p className='text-gray-500'>No results found.</p>
          </div>
        )}

      {!isLoading && !search && (
        <div className='my-8 text-center'>
          <p className='text-gray-500'>
            Search for players, coaches, referees, and teams.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
