import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import PageHeader from '../../components/PageHeader';
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
      <PageHeader title='Players' description='Manage players' />
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
