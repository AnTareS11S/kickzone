import { useEffect, useState } from 'react';
import { Input } from '../components/ui/input';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

const Search = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const res = await fetch(`/api/player?q=${search}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    handleSearch();
  }, [search]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div className='searchbar mt-5 relative'>
        <img
          src='/public/search.svg'
          alt='search'
          width={25}
          height={25}
          className='object-contain absolute top-1/2 transform -translate-y-1/2 left-5'
        />
        <Input
          id='text'
          value={search}
          onChange={handleChange}
          autoComplete='off'
          placeholder='Search...'
          className='w-full ring-2 bg-slate-200 text-text-text-heading2-semibold ring-white hover:ring-primary-500 transition duration-300 p-6 pl-9'
        />
      </div>
      {search && searchResults?.players?.length !== 0 && (
        <div className='m-4'>
          <p className='text-heading3-bold '>Players</p>
          <Separator className='my-4' />
        </div>
      )}
      {search &&
        searchResults?.players?.map((player) => (
          <Card key={player._id} className='user-card m-4 flex items-center'>
            <img
              src={player.photo}
              alt={player.name}
              className='rounded-full object-cover mr-2 flex-shrink-0 w-16 h-16'
            />
            <Link
              to={`/player/${player._id}`}
              className='flex-1 text-ellipsis text-base-semibold'
            >
              {player.name} {player.surname}
            </Link>
          </Card>
        ))}
      {search && searchResults?.teams?.length !== 0 && (
        <div className='m-4'>
          <p className='text-heading3-bold'>Teams</p>
          <Separator className='my-4' />
        </div>
      )}
      {search &&
        searchResults?.teams?.map((team) => (
          <Card key={team._id} className='user-card  m-4 flex items-center'>
            <img
              src={team.logo}
              alt={team.name}
              className='rounded-full object-cover mr-2 flex-shrink-0 w-16 h-16'
            />
            <Link
              to={`/league/team/${team._id}`}
              className='flex-1 text-ellipsis text-base-semibold'
            >
              {team.name}
            </Link>
          </Card>
        ))}

      {!search && (
        <div className='w-fit mx-auto my-40'>
          <p className='text-body-semibold'>
            Search for players and teams to explore.
          </p>
        </div>
      )}

      {search && searchResults?.players?.length === 0 && (
        <div className='w-fit mx-auto my-40'>
          <p className='text-body-semibold'>No results found.</p>
        </div>
      )}
    </>
  );
};

export default Search;
