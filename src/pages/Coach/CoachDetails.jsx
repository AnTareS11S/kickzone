import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import Spinner from '../../components/Spinner';
import { useParams } from 'react-router-dom';
import { useFetchCoachById } from '../../components/hooks/useFetchCoachById';
import BackButton from '../../components/BackButton';
import { Separator } from '../../components/ui/separator';
import { FaFlag, FaCity, FaBirthdayCake } from 'react-icons/fa';

const CoachDetails = () => {
  const coachId = useParams().id;
  const { coach, loading } = useFetchCoachById(coachId);

  if (loading) {
    return <Spinner />;
  }

  return (
    <article className='py-8'>
      <BackButton />
      <Separator />
      <Card className='bg-white shadow-lg rounded-lg flex flex-col'>
        <CardHeader className='bg-gray-100 p-6  md:flex-row items-center'>
          <div className='w-40 h-40 rounded-full  mb-4 md:mb-0 md:mr-6'>
            <img
              src={
                coach?.imageUrl ||
                'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
              }
              alt={`Photo of ${coach?.name}`}
              className='object-cover w-full h-full'
            />
          </div>
          <div>
            <CardTitle className='text-2xl font-bold mb-2'>
              {coach?.name + ' ' + coach?.surname}
            </CardTitle>
            <CardDescription className='text-gray-600'>
              {coach?.bio} | {coach?.currentTeam}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='p-6 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Personal Information</h3>
            <div className='flex items-center mb-2'>
              <FaBirthdayCake className='text-gray-500 mr-2' />
              <p className='text-gray-700'>
                {coach.birthDate?.toString().slice(0, 10)}
              </p>
            </div>
            <div className='flex items-center mb-2'>
              <FaFlag className='text-gray-500 mr-2' />
              <p className='text-gray-700'>{coach?.nationality}</p>
            </div>
            <div className='flex items-center mb-2'>
              <FaCity className='text-gray-500 mr-2' />
              <p className='text-gray-700'>{coach?.city}</p>
            </div>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Previous Teams</h3>
            <ul className='list-disc pl-4 text-gray-700'>
              {coach.teams?.map((team, index) => (
                <li key={index}>{team.split(':')[0]}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </article>
  );
};

export default CoachDetails;
