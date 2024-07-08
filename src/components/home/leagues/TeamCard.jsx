import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../ui/card';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const TeamCard = ({ data }) => {
  const defaultLogo =
    'https://futbolistpro-bucket.s3.eu-north-1.amazonaws.com/team_img_default.png';

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8'>
      {data.map((team) => (
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
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default TeamCard;
