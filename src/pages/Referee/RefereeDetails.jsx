import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import Spinner from '../../components/Spinner';
import { useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { Separator } from '../../components/ui/separator';
import { useFetchRefereeById } from '../../components/hooks/useFetchRefereeById';
import { FaFlag, FaCity, FaBirthdayCake } from 'react-icons/fa';

const RefereeDetails = () => {
  const refereeId = useParams().id;
  const { referee, loading } = useFetchRefereeById(refereeId);

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
                referee?.imageUrl ||
                'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
              }
              alt={`Photo of ${referee?.name}`}
              className='object-cover w-full h-full'
            />
          </div>
          <div>
            <CardTitle className='text-2xl font-bold mb-2'>
              {referee?.name + ' ' + referee?.surname}
            </CardTitle>
            <CardDescription className='text-gray-600'>
              {referee?.bio}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='p-6 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Personal Information</h3>
            <div className='flex items-center mb-2'>
              <FaBirthdayCake className='text-gray-500 mr-2' />
              <p className='text-gray-700'>
                {referee.birthDate?.toString()?.slice(0, 10)}
              </p>
            </div>
            <div className='flex items-center mb-2'>
              <FaFlag className='text-gray-500 mr-2' />
              <p className='text-gray-700'>{referee?.nationality?.name}</p>
            </div>
            <div className='flex items-center mb-2'>
              <FaCity className='text-gray-500 mr-2' />
              <p className='text-gray-700'>{referee?.city}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
};

export default RefereeDetails;
