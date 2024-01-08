import { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Separator } from '../../components/ui/separator';
import PlayerForm from '../../components/player/PlayerForm';

const PlayerProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const getPlayer = async () => {
      try {
        const res = await fetch(`/api/player/get/${currentUser._id}`);
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch data!');
        }
        const data = await res.json();

        setPlayer(data);
      } catch (error) {
        console.log(error);
      }
    };
    getPlayer();
  }, [currentUser._id]);

  return (
    <div className='space-y-6 max-w-screen-md mx-auto'>
      <div>
        <h3 className='text-lg font-medium'>Player Profile</h3>
        <p className='text-sm text-muted-foreground'>
          Fulfill your player profile
        </p>
      </div>
      <Separator />
      <PlayerForm currentUser={currentUser} playerData={player} />
    </div>
  );
};

export default PlayerProfile;
