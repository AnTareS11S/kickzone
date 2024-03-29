import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import Spinner from '../../components/Spinner';

const CoachDetails = () => {
  const [coach, setCoach] = useState({});
  const [loading, setLoading] = useState(false);
  const pathname = window.location.pathname.split('/').pop();

  useEffect(() => {
    const getCoach = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/coach/${pathname}`);
        const data = await res.json();
        setCoach(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getCoach();
  }, [pathname]);

  if (loading)
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner />
      </div>
    );

  return (
    <Card className='bg-white shadow-lg p-6 rounded-md'>
      <CardHeader className='mb-4 flex items-center flex-row'>
        <div className='w-40 h-40'>
          <img
            src={
              coach.photo ||
              'https://firebasestorage.googleapis.com/v0/b/futbolistapro.appspot.com/o/avatars%2Fblank-profile-picture-973460_960_720.webp?alt=media&token=5779eb88-d84b-46f3-bef6-3c2648a8fc9c'
            }
            alt={`Photo of ${coach.name}`}
            className='object-contain h-full w-full rounded-full mt-4'
          />
        </div>
        <div className='ml-4 flex flex-col justify-between'>
          <CardTitle className='text-heading2-semibold mb-2'>
            {coach.name + ' ' + coach.surname}
          </CardTitle>
          <CardDescription className='text-gray-700'>
            {coach.bio}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className='grid grid-cols-2 gap-6 pl-12'>
        <div>
          <p className='text-sm font-semibold text-gray-500'>Country:</p>
          <p className='text-gray-800'>{coach.nationality}</p>
        </div>
        <div>
          <p className='text-sm font-semibold text-gray-500'>City:</p>
          <p className='text-gray-800'>{coach.city}</p>
        </div>
        <div>
          <p className='text-sm font-semibold text-gray-500'>Birth Date:</p>
          <p className='text-gray-800'>
            {coach.birthDate?.toString().slice(0, 10)}
          </p>
        </div>
        <div>
          <p className='text-sm font-semibold text-gray-500'>Teams:</p>
          <ul className='list-disc pl-4 text-gray-800'>
            {coach.teams?.map((team, index) => (
              <li key={index}>{team.split(':')[0]}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachDetails;
