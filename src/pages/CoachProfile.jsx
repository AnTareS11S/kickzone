import CoachForm from '../components/coach/CoachForm';
import { Separator } from '../components/ui/separator';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const CoachProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [coach, setCoach] = useState(null);

  useEffect(() => {
    const getCoach = async () => {
      try {
        const res = await fetch(`/api/coach/get/${currentUser._id}`);
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch data!');
        }
        const data = await res.json();

        setCoach(data);
      } catch (error) {
        console.log(error);
      }
    };
    getCoach();
  }, [currentUser._id]);
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Coach Profile</h3>
        <p className='text-sm text-muted-foreground'>
          Fulfill your coach profile
        </p>
      </div>
      <Separator />
      <CoachForm currentUser={currentUser} coachData={coach} />
    </div>
  );
};

export default CoachProfile;
