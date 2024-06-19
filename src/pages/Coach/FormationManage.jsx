import BackButton from '../../components/BackButton';
import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';
import { Separator } from '../../components/ui/separator';
import { formationFormSchema } from '../../lib/validation/PositionValidation';

const columns = [
  {
    name: 'No.',
    selector: (row, index) => index + 1,
    grow: 0,
  },
  {
    name: 'Formation',
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: 'Description',
    selector: (row) => row.description,
    sortable: true,
  },
];

const FormationManage = () => {
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
        <div className='text-heading2-bold'>Formations</div>
        <p className='text-sm text-muted-foreground'>Manage formations.</p>
      </div>
      <Separator />
      <CrudPanel
        apiPath='formation'
        columns={columns}
        fields={fields}
        title='Formation'
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={formationFormSchema}
        isAction={true}
        isExpandable={false}
        defaultValues={{
          name: '',
          description: '',
        }}
      />
    </div>
  );
};

export default FormationManage;
