import CoachForm from '../components/coach/CoachForm';
import { Separator } from '../components/ui/separator';

import { useSelector } from 'react-redux';

const CoachProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className='space-y-6 max-w-screen-md mx-auto'>
      <div>
        <h3 className='text-lg font-medium'>Coach Profile</h3>
        <p className='text-sm text-muted-foreground'>
          Fulfill your coach profile
        </p>
      </div>
      <Separator />
      <CoachForm currentUser={currentUser} />
    </div>
  );
};

export default CoachProfile;
