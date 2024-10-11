import AdminForm from '../../components/admin/AdminForm';
import { Separator } from '../../components/ui/separator';

import { useSelector } from 'react-redux';

const AdminProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className='space-y-6 max-w-screen-md mx-auto'>
      <div>
        <h3 className='text-lg font-medium'>Admin Profile</h3>
        <p className='text-sm text-muted-foreground'>
          Fulfill your admin profile
        </p>
      </div>
      <Separator />
      <AdminForm currentUser={currentUser} />
    </div>
  );
};

export default AdminProfile;
