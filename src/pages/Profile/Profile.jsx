import ProfileForm from '../../components/account/ProfileForm';
import { Separator } from '../../components/ui/separator';

const Profile = () => {
  return (
    <div className='space-y-6 max-w-screen-md mx-auto'>
      <div>
        <h3 className='text-lg font-medium'>Profile</h3>
        <p className='text-sm text-muted-foreground'>
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
};

export default Profile;
