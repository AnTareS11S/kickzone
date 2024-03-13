import BackButton from '../../components/BackButton';
import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import { Separator } from '../../components/ui/separator';
import { playerFormSchema } from '../../lib/validation/PlayerValidation';

const columns = [
  {
    name: 'No.',
    selector: (row, index) => index + 1,
    grow: 0,
  },
  {
    name: 'Name',
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: 'Surname',
    selector: (row) => row.surname,
    sortable: true,
  },
  {
    name: 'Nationality',
    selector: (row) => row.nationality,
    sortable: true,
  },
  {
    name: 'Position',
    selector: (row) => row.position,
    sortable: true,
  },
  {
    name: 'Team',
    selector: (row) => row.currentTeam,
    sortable: true,
  },
];

const PlayerManage = () => {
  return (
    <div className='space-y-6'>
      <BackButton />
      <div>
        <div className='text-heading2-bold'>Players</div>
        <p className='text-sm text-muted-foreground'>Manage players.</p>
      </div>
      <Separator />
      <CrudPanel
        apiPath='player'
        columns={columns}
        title='Player'
        onDeleteComponent={DeleteEntity}
        formSchema={playerFormSchema}
        isExpandable={false}
        isAction={true}
      />
    </div>
  );
};

export default PlayerManage;
