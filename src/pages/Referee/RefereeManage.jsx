import BackButton from '../../components/BackButton';
import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import { Separator } from '../../components/ui/separator';
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

const RefereeManage = () => {
  return (
    <div className='space-y-6'>
      <BackButton />
      <div>
        <div className='text-heading2-bold'>Referees</div>
        <p className='text-sm text-muted-foreground'>Manage referees.</p>
      </div>
      <Separator />
      <CrudPanel
        apiPath='referee'
        columns={columns}
        title='Referee'
        onDeleteComponent={DeleteEntity}
        formSchema={usersFormSchema}
        isExpandable={false}
        isAction={true}
      />
    </div>
  );
};

export default RefereeManage;
