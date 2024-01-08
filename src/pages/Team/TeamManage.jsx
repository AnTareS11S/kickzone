import TeamsPanel from '../../components/admin/teams/TeamsPanel';
import { Separator } from '../../components/ui/separator';

const TeamManage = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Teams</h3>
        <p className='text-sm text-muted-foreground'>Manage teams</p>
      </div>
      <Separator />
      <TeamsPanel />
    </div>
  );
};

export default TeamManage;
