import LeaguePanel from '../components/admin/leagues/LeaguePanel';
import { columns } from '../components/admin/leagues/columns';
import { Separator } from '../components/ui/separator';

const LeagueManage = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Manage Leagues</h3>
        <p className='text-sm text-muted-foreground'>Manage leagues.</p>
      </div>
      <Separator />
      <LeaguePanel columns={columns} />
    </div>
  );
};

export default LeagueManage;
