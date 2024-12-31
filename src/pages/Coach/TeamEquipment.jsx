import { Badge } from '../../components/ui/badge';
import PageHeader from '../../components/PageHeader';
import CrudPanel from '../../components/CrudPanel';
import EditEntity from '../../components/EditEntity';
import DeleteEntity from '../../components/DeleteEntity';
import { teamEquipmentValidationSchema } from '../../lib/validation/TeamValidation';

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
    name: 'Quantity',
    selector: (row) => row.quantity,
    sortable: true,
  },
  {
    name: 'Condition',
    selector: (row) => row.condition,
    sortable: true,
  },
  {
    name: 'Last Checked',
    selector: (row) => row.lastChecked,
    sortable: true,
  },
  {
    name: 'Status',
    selector: (row) => (
      <Badge className={getStatusColor(row.status)}>{row.status}</Badge>
    ),
    sortable: true,
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-800';
    case 'In Use':
      return 'bg-blue-100 text-blue-800';
    case 'Needs Replacement':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const TeamEquipment = () => {
  const fields = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      name: 'name',
    },
    {
      id: 'quantity',
      label: 'Quantity',
      type: 'number',
      name: 'quantity',
    },
    {
      id: 'condition',
      label: 'Condition',
      type: 'select',
      name: 'condition',
      items: ['Good:1', 'Fair:2', 'Poor:3'],
      placeholder: 'Select a Condition',
      idFlag: true,
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      name: 'status',
      items: ['Available:1', 'In Use:2', 'Needs Replacement:3'],
      placeholder: 'Select a Status',
      idFlag: true,
    },
  ];

  return (
    <div className='space-y-6'>
      <PageHeader title='Team Equipment' description='Manage team equipment' />
      <CrudPanel
        apiPath='team-equipment'
        columns={columns}
        fields={fields}
        title='Team Equipment'
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={teamEquipmentValidationSchema}
        isAction={true}
        isExpandable={false}
        defaultValues={{
          name: '',
          quantity: '0',
          condition: '',
          status: '',
        }}
      />
    </div>
  );
};

export default TeamEquipment;
