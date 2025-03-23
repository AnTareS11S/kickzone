import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../ui/card';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

const TeamCard = ({ data }) => {
  const defaultLogo =
    'https://futbolistpro-bucket.s3.eu-north-1.amazonaws.com/team_img_default.png';

  const [filteredTeams, setFilteredTeams] = useState(data);
  const [filterOption, setFilterOption] = useState('default');

  useEffect(() => {
    let result = [...data];

    if (filterOption === 'fans') {
      result.sort((a, b) => {
        const aFans = a.fans?.length || 0;
        const bFans = b.fans?.length || 0;
        return bFans - aFans; // Sort descending (most fans first)
      });
    }

    setFilteredTeams(result);
  }, [data, filterOption]);

  const handleFilterChange = (value) => {
    setFilterOption(value);

    // Reset teams to original when switching to default
    if (value === 'default') {
      setFilteredTeams(data);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='bg-white rounded-lg shadow p-4 mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
          <div>
            <label className='block text-sm font-medium mb-2'>
              View Option
            </label>
            <Select value={filterOption} onValueChange={handleFilterChange}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Filter by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='default'>All Teams</SelectItem>
                <SelectItem value='fans'>By Fans</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredTeams.length === 0 ? (
        <div className='text-center py-12 bg-gray-50 rounded-lg border'>
          <p className='text-gray-500 text-lg'>
            No teams match your filter criteria
          </p>
          <button
            onClick={() => {
              setFilterOption('default');
            }}
            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {filteredTeams.map((team) => (
            <Link
              key={team._id}
              to={`/league/team/${team._id}`}
              className='transition-transform hover:scale-105'
            >
              <Card className='h-full shadow-lg hover:shadow-xl transition-shadow duration-300'>
                <div className='aspect-w-16 aspect-h-9'>
                  <LazyLoadImage
                    src={team.logo ? team.logoUrl : defaultLogo}
                    alt={`Logo of ${team.name}`}
                    effect='blur'
                    className='object-contain w-full h-36'
                    wrapperClassName='w-full h-full'
                  />
                </div>
                <CardContent className='p-4'>
                  <h3 className='text-xl font-semibold text-center truncate'>
                    {team.name}
                  </h3>
                  {filterOption === 'fans' && (
                    <p className='text-sm text-center mt-1'>
                      <span className='font-medium text-blue-600'>
                        {team.fans?.length || 0}
                      </span>
                      <span className='text-gray-600'> fans</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamCard;
