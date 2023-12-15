import TeamsPanel from '../components/admin/teams/TeamsPanel';
import { Separator } from '../components/ui/separator';
import { columns } from '../components/admin/teams/columns';

const TeamManage = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Manage Teams</h3>
        <p className='text-sm text-muted-foreground'>Manage teams.</p>
      </div>
      <Separator />
      <TeamsPanel columns={columns} />
    </div>
  );
};

export default TeamManage;
