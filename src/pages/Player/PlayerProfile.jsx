import { Separator } from '../../components/ui/separator';
import PlayerForm from '../../components/player/PlayerForm';

const PlayerProfile = () => {
  return (
    <div className='space-y-6 max-w-screen-md mx-auto'>
      <div>
        <h3 className='text-lg font-medium'>Player Profile</h3>
        <p className='text-sm text-muted-foreground'>
          Fulfill your player profile
        </p>
      </div>
      <Separator />
      <PlayerForm />
    </div>
  );
};

export default PlayerProfile;
