import { GetCoachByUserId } from '../../api/getCoachByUserId';
import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';
import PageHeader from '../../components/PageHeader';
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
  const { coach } = GetCoachByUserId();

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
      <PageHeader title='Training types' description='Manage training types' />
      <CrudPanel
        apiPath='training-type'
        columns={columns}
        fields={fields}
        title='Training Type'
        objectId={coach?._id}
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={trainingTypeValidationSchema}
        isAction={true}
        defaultValues={{
          name: '',
          description: '',
        }}
      />
    </div>
  );
};

export default TrainingTypeManage;
