import StadiumPanel from '../../components/admin/stadium/StadiumPanel';
import { Separator } from '../../components/ui/separator';

const StadiumManage = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Stadiums</h3>
        <p className='text-sm text-muted-foreground'>Manage stadiums.</p>
      </div>
      <Separator />
      <StadiumPanel />
    </div>
  );
};

export default StadiumManage;
