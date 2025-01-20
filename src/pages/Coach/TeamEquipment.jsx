import { Badge } from '../../components/ui/badge';
import PageHeader from '../../components/PageHeader';
import CrudPanel from '../../components/CrudPanel';
import EditEntity from '../../components/EditEntity';
import DeleteEntity from '../../components/DeleteEntity';
import { teamEquipmentValidationSchema } from '../../lib/validation/TeamValidation';
import { GetCoachByUserId } from '../../api/getCoachByUserId';

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
    selector: (row) => row.updatedAt.split('T')[0],
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
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'In Use':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'Needs Replacement':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const TeamEquipment = () => {
  const { coach } = GetCoachByUserId();

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
      items: [{ name: 'Good' }, { name: 'Fair' }, { name: 'Poor' }],
      placeholder: 'Select a Condition',
      idFlag: false,
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      name: 'status',
      items: [
        { name: 'Available' },
        { name: 'In Use' },
        { name: 'Needs Replacement' },
      ],
      placeholder: 'Select a Status',
      idFlag: false,
    },
  ];

  return (
    <div className='space-y-6'>
      <PageHeader title='Team Equipment' description='Manage team equipment' />
      <CrudPanel
        apiPath='team-equipment'
        columns={columns}
        fields={fields}
        objectId={coach?.currentTeam}
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
