import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaTimes,
  FaUser,
  FaUserTie,
  FaUserCog,
  FaFutbol,
} from 'react-icons/fa';

const SearchResult = ({ title, items, icon: Icon, linkPrefix }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className='my-8'
  >
    <h3 className='text-lg font-bold mb-4 flex items-center'>
      <Icon className='mr-2' />
      {title}
    </h3>
    <div className='border-t border-gray-200 dark:border-gray-700 mb-4' />
    {items.map((item) => (
      <motion.div
        key={item._id}
        whileHover={{ scale: 1.02 }}
        className='bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4 hover:shadow-md transition-all duration-300'
      >
        <Link
          to={`${linkPrefix}/${item._id}`}
          className='flex items-center p-4'
        >
          <img
            src={
              item.imageUrl ||
              item.logoUrl ||
              'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
            }
            alt={item.name}
            className='rounded-full w-12 h-12 object-cover mr-4'
          />
          <div className='flex-grow'>
            <h4 className='text-base font-semibold text-gray-900 dark:text-white'>
              {item.name} {item.surname}
            </h4>
          </div>
        </Link>
      </motion.div>
    ))}
  </motion.div>
);

const Search = () => {
  const [search, setSearch] = useState(
    localStorage.getItem('lastSearch') || ''
  );
  const [searchResults, setSearchResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      if (!search) {
        setSearchResults({});
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/player?q=${search}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(handleSearch, 300);

    localStorage.setItem('lastSearch', search);
    const clearStorage = setTimeout(
      () => localStorage.removeItem('lastSearch'),
      60000
    );

    return () => {
      clearTimeout(debounce);
      clearTimeout(clearStorage);
    };
  }, [search]);

  return (
    <div className='container mx-auto p-4'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8'
      >
        <FaSearch className='text-gray-500 dark:text-gray-400 ml-4' />
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search...'
          className='flex-grow py-2 px-4 bg-transparent focus:outline-none dark:text-white'
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className='p-2 focus:outline-none'
          >
            <FaTimes className='text-gray-500 dark:text-gray-400' />
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='text-center text-gray-500 dark:text-gray-400 my-8'
          >
            Loading...
          </motion.div>
        ) : search ? (
          <>
            {searchResults.players?.length > 0 && (
              <SearchResult
                title='Players'
                items={searchResults.players}
                icon={FaUser}
                linkPrefix='/player'
              />
            )}
            {searchResults.coaches?.length > 0 && (
              <SearchResult
                title='Coaches'
                items={searchResults.coaches}
                icon={FaUserTie}
                linkPrefix='/coach'
              />
            )}
            {searchResults.referees?.length > 0 && (
              <SearchResult
                title='Referees'
                items={searchResults.referees}
                icon={FaUserCog}
                linkPrefix='/referee'
              />
            )}
            {searchResults.teams?.length > 0 && (
              <SearchResult
                title='Teams'
                items={searchResults.teams}
                icon={FaFutbol}
                linkPrefix='/league/team'
              />
            )}
            {Object.values(searchResults).every((arr) => arr.length === 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='text-center text-gray-500 dark:text-gray-400 my-8'
              >
                No results found.
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='text-center text-gray-500 dark:text-gray-400 my-8'
          >
            Search for players, coaches, referees, and teams.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
