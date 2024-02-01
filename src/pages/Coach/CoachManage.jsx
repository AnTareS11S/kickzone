import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import { Separator } from '../../components/ui/separator';
import { coachFormSchema } from '../../lib/validation/CoachValidation';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  return (
    <div className='space-y-6'>
      <div
        className='cursor-pointer mb-2 inline-flex items-center justify-center bg-primary-500 hover:bg-purple-500 text-white font-bold py-1 px-3 rounded'
        onClick={() => navigate(-1)}
      >
        <span className='mr-1'>&#8592;</span> Back
      </div>
      <div>
        <div className='text-heading2-bold'>Coaches</div>
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
