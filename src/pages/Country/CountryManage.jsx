import CountryPanel from '../../components/admin/country/CountryPanel';

import { Separator } from '../../components/ui/separator';

const CountryManage = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Countries</h3>
        <p className='text-sm text-muted-foreground'>Manage countries.</p>
      </div>
      <Separator />
      <CountryPanel />
    </div>
  );
};

export default CountryManage;
