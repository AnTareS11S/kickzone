import LeaguePanel from '../../components/admin/leagues/LeaguePanel';
import { Separator } from '../../components/ui/separator';

const LeagueManage = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Leagues</h3>
        <p className='text-sm text-muted-foreground'>Manage leagues.</p>
      </div>
      <Separator />
      <LeaguePanel />
    </div>
  );
};

export default LeagueManage;
