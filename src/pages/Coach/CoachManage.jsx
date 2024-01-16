import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import { Separator } from '../../components/ui/separator';
import { coachFormSchema } from '../../lib/validation/CoachValidation';

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
];

const CoachManage = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Coaches</h3>
        <p className='text-sm text-muted-foreground'>Manage coaches.</p>
      </div>
      <Separator />
      <CrudPanel
        apiPath='coach'
        columns={columns}
        title='Coach'
        onDeleteComponent={DeleteEntity}
        formSchema={coachFormSchema}
      />
    </div>
  );
};

export default CoachManage;
