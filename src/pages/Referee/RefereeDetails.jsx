import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import Spinner from '../../components/Spinner';
import { Link, useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { Separator } from '../../components/ui/separator';
import { useFetchRefereeById } from '../../components/hooks/useFetchRefereeById';
import { FaFlag, FaCity, FaBirthdayCake, FaCalendar } from 'react-icons/fa';
import { TbRectangleVerticalFilled, TbBuildingStadium } from 'react-icons/tb';
import { useFetchRefereeStatsById } from '../../components/hooks/useFetchRefereeStatsById';

const RefereeDetails = () => {
  const refereeId = useParams().id;
  const { referee, loading } = useFetchRefereeById(refereeId);
  const { refereeStats, loading: load } = useFetchRefereeStatsById(refereeId);

  if (loading || load) {
    return <Spinner />;
  }

  return (
    <article className='py-8'>
      <BackButton />
      <Separator />
      <Card className='bg-white shadow-lg rounded-lg'>
        <CardHeader className='bg-gray-100 p-6 flex flex-col md:flex-row items-center'>
          <div className='w-40 h-40 rounded-full mb-4 md:mb-0 md:mr-6'>
            <img
              src={
                referee?.imageUrl ||
                'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
              }
              alt={`Photo of ${referee?.name}`}
              className='object-cover w-full h-full'
            />
          </div>
          <div>
            <CardTitle className='text-3xl font-bold mb-2'>
              {referee?.name + ' ' + referee?.surname}
            </CardTitle>
            <CardDescription className='text-gray-600'>
              {referee?.bio}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='p-6 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h3 className='text-xl font-semibold mb-4'>Personal Information</h3>
            <div className='flex items-center mb-2'>
              <FaBirthdayCake className='h-5 w-5 text-gray-500 mr-2' />
              <p className='text-gray-700'>
                {referee.birthDate?.toString()?.slice(0, 10)}
              </p>
            </div>
            <div className='flex items-center mb-2'>
              <FaFlag className='h-5 w-5 text-gray-500 mr-2' />
              <p className='text-gray-700'>{referee?.nationality?.name}</p>
            </div>
            <div className='flex items-center'>
              <FaCity className='h-5 w-5 text-gray-500 mr-2' />
              <p className='text-gray-700'>{referee?.city}</p>
            </div>
          </div>
          <div>
            <h3 className='text-xl font-semibold mb-4'>Referee Statistics</h3>
            <div className='flex items-center mb-2'>
              <TbRectangleVerticalFilled className='h-5 w-5 text-yellow-500 mr-2' />
              <p className='text-gray-700'>
                Yellow Cards: {refereeStats?.yellowCards}
              </p>
            </div>
            <div className='flex items-center mb-2'>
              <TbRectangleVerticalFilled className='h-5 w-5 text-red-500 mr-2' />
              <p className='text-gray-700'>
                Red Cards: {refereeStats?.redCards}
              </p>
            </div>
            <div className='flex items-center mb-2'>
              <TbBuildingStadium className='h-5 w-5 mr-2' />
              <p className='text-gray-700'>Matches: {refereeStats?.matches}</p>
            </div>
            <div className='flex items-center'>
              <FaCalendar className='h-5 w-5 text-gray-500 mr-2' />
              <Link to={`/results/${refereeStats?.lastMatchId}`}>
                <p className='text-gray-700 hover:text-primary-500'>
                  Last Match as Main Referee: {refereeStats?.lastMatchName}
                </p>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
};

export default RefereeDetails;
