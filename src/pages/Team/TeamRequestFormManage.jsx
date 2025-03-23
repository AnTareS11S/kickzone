import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import PageHeader from '../../components/PageHeader';

const columns = [
  {
    name: 'No.',
    selector: (row, index) => index + 1,
    grow: 0,
  },
  {
    name: 'Team Name',
    cell: (row) => row.name,
    sortable: true,
  },
  {
    name: 'Coach',
    selector: (row) => row.coach,
    sortable: true,
  },
  {
    name: 'Stadium',
    selector: (row) => row.stadium,
    sortable: true,
  },

  {
    name: 'Year Founded',
    selector: (row) => row.yearFounded,
    sortable: true,
  },
];

const TeamRequestsFormManage = () => {
  return (
    <div className='space-y-6'>
      <PageHeader title='Team Requests' description='Manage team requests' />
      <CrudPanel
        apiPath='team-requests'
        columns={columns}
        onDeleteComponent={DeleteEntity}
        title='Team Request'
        isExpandable={false}
        isAction={true}
      />
    </div>
  );
};

export default TeamRequestsFormManage;
