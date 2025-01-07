import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import Spinner from '../../components/Spinner';
import BackButton from '../../components/BackButton';
import { FaBirthdayCake, FaFlag, FaCity, FaCalendar } from 'react-icons/fa';
import { MdSportsSoccer } from 'react-icons/md';
import { TbRectangleVerticalFilled as RefereeCard } from 'react-icons/tb';
import { GetRefereeById } from '../../api/getRefereeById';
import { GetRefereeStatsById } from '../../api/getRefereeStatsById';

const RefereeDetails = () => {
  const refereeId = useParams().id;
  const { referee, loading } = GetRefereeById(refereeId);
  const { refereeStats, loading: statsLoading } =
    GetRefereeStatsById(refereeId);

  if (loading || statsLoading) {
    return <Spinner />;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <BackButton />
      <Separator className='my-6' />
      <Card className='bg-white shadow-xl rounded-lg overflow-hidden'>
        <CardHeader className='bg-gradient-to-r from-blue-500 to-purple-600 p-6'>
          <div className='flex flex-col md:flex-row items-center'>
            <div className='w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 md:mb-0 md:mr-6'>
              <img
                src={
                  referee?.imageUrl ||
                  'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
                }
                alt={`Photo of ${referee?.name}`}
                className='object-cover w-full h-full'
              />
            </div>
            <div className='text-center md:text-left'>
              <h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>
                {referee?.name} {referee?.surname}
              </h1>
              <p className='text-lg text-blue-100'>{referee?.bio}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='space-y-4'>
              <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                Personal Information
              </h2>
              <InfoItem
                icon={FaBirthdayCake}
                label='Birth Date'
                value={referee.birthDate?.toString()?.slice(0, 10)}
              />
              <InfoItem
                icon={FaFlag}
                label='Nationality'
                value={referee?.nationality?.name}
              />
              <InfoItem icon={FaCity} label='City' value={referee?.city} />
            </div>
            <div className='space-y-4'>
              <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                Referee Statistics
              </h2>
              <InfoItem
                icon={RefereeCard}
                label='Yellow Cards'
                value={refereeStats?.yellowCards || 0}
                iconColor='text-yellow-500'
              />
              <InfoItem
                icon={RefereeCard}
                label='Red Cards'
                value={refereeStats?.redCards || 0}
                iconColor='text-red-500'
              />
              <InfoItem
                icon={MdSportsSoccer}
                label='Matches'
                value={refereeStats?.matches || 0}
              />
              <LastMatch
                lastMatchId={refereeStats?.lastMatchId}
                lastMatchName={refereeStats?.lastMatchName}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
  iconColor = 'text-gray-500',
}) => (
  <div className='flex items-center space-x-3'>
    <Icon className={`w-6 h-6 ${iconColor}`} />
    <div>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='text-lg font-medium text-gray-900'>{value}</p>
    </div>
  </div>
);

const LastMatch = ({ lastMatchId, lastMatchName }) => (
  <div className='flex items-center space-x-3'>
    <FaCalendar className='w-6 h-6 text-gray-500' />
    <div>
      <p className='text-sm text-gray-500'>Last Match as Referee</p>
      {lastMatchId ? (
        <Link
          to={`/results/${lastMatchId}`}
          className='text-lg font-medium text-blue-600 hover:text-blue-800'
        >
          {lastMatchName}
        </Link>
      ) : (
        <p className='text-lg font-medium text-gray-900'>N/A</p>
      )}
    </div>
  </div>
);

export default RefereeDetails;
