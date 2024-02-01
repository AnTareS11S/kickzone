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
      <div>
        <h3 className='text-lg font-medium'>Training Types Manage</h3>
        <p className='text-sm text-muted-foreground'>
          Manage your trainings types
        </p>
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
