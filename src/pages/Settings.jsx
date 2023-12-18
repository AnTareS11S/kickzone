import ChangePassword from '../components/account/ChangePassword';
import DeleteAccount from '../components/account/DeleteAccount';
import { Separator } from '../components/ui/separator';
const Settings = () => {
  return (
    <div className='space-y-6 max-w-screen-md mx-auto'>
      <div>
        <h3 className='text-lg font-medium'>Settings</h3>
        <p className='text-sm text-muted-foreground'>Manage your account</p>
      </div>
      <Separator />
      <ChangePassword />
      <Separator />
      <DeleteAccount />
    </div>
  );
};

export default Settings;
