import BackButton from '../../components/BackButton';
import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';
import { useFetchCoachByUserId } from '../../components/hooks/useFetchCoachByUserId';
import { Separator } from '../../components/ui/separator';
import { trainingTypeValidationSchema } from '../../lib/validation/TrainingValidation';

const columns = [
  {
    name: 'No.',
    selector: (row, index) => index + 1,
    grow: 0,
  },
  {
    name: 'Type',
    selector: (row) => row.name,
    sortable: true,
  },
];

const TrainingTypeManage = () => {
  const coach = useFetchCoachByUserId();

  const fields = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      name: 'name',
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      name: 'description',
    },
  ];
  return (
    <div className='space-y-6'>
      <BackButton />
      <div>
        <div className='text-heading2-bold'>Training types</div>
        <p className='text-sm text-muted-foreground'>Manage training types.</p>
      </div>

      <Separator />
      <CrudPanel
        apiPath='training-type'
        columns={columns}
        fields={fields}
        title='Training Type'
        objectId={coach?._id}
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={trainingTypeValidationSchema}
        defaultValues={{
          name: '',
          description: '',
        }}
      />
    </div>
  );
};

export default TrainingTypeManage;
