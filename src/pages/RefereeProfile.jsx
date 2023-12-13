import { useEffect } from 'react';
import RefereeForm from '../components/referee/RefereeForm';

import { useSelector } from 'react-redux';
import { useState } from 'react';

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

  return <RefereeForm currentUser={currentUser} refereeData={referee} />;
};

export default RefereeProfile;
