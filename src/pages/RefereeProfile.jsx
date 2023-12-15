import { useEffect } from 'react';
import RefereeForm from '../components/referee/RefereeForm';

import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Separator } from '../components/ui/separator';

const RefereeProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [referee, setReferee] = useState(null);

  useEffect(() => {
    const getReferee = async () => {
      try {
        const res = await fetch(`/api/referee/get/${currentUser._id}`);
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch data!');
        }
        const data = await res.json();

        setReferee(data);
      } catch (error) {
        console.log(error);
      }
    };
    getReferee();
  }, [currentUser._id]);

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Referee Profile</h3>
        <p className='text-sm text-muted-foreground'>
          Fulfill your referee profile
        </p>
      </div>
      <Separator />
      <RefereeForm currentUser={currentUser} refereeData={referee} />
    </div>
  );
};

export default RefereeProfile;
