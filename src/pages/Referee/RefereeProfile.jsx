import RefereeForm from '../../components/referee/RefereeForm';
import { useSelector } from 'react-redux';
import { Separator } from '../../components/ui/separator';

const RefereeProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className='space-y-6 max-w-screen-md mx-auto'>
      <div>
        <h3 className='text-lg font-medium'>Referee Profile</h3>
        <p className='text-sm text-muted-foreground'>
          Fulfill your referee profile
        </p>
      </div>
      <Separator />
      <RefereeForm currentUser={currentUser} />
    </div>
  );
};

export default RefereeProfile;
