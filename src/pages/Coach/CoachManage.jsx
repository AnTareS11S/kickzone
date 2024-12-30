import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import PageHeader from '../../components/PageHeader';
import { usersFormSchema } from '../../lib/validation/UsersValidation';

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
    selector: (row) => row.nationality.name,
    sortable: true,
  },
];

const CoachManage = () => {
  return (
    <div className='space-y-6'>
      <PageHeader title='Coaches' description='Manage coaches' />
      <CrudPanel
        apiPath='coach'
        columns={columns}
        title='Coach'
        onDeleteComponent={DeleteEntity}
        formSchema={usersFormSchema}
        isExpandable={false}
        isAction={true}
      />
    </div>
  );
};

export default CoachManage;
