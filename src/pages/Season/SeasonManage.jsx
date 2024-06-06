import { Separator } from '../../components/ui/separator';
import CrudPanel from '../../components/CrudPanel';
import EditEntity from '../../components/EditEntity';
import DeleteEntity from '../../components/DeleteEntity';
import { seasonFormSchema } from '../../lib/validation/SeasonValidation';
import BackButton from '../../components/BackButton';

const columns = [
  {
    name: 'No.',
    selector: (row, index) => index + 1,
    grow: 0,
  },
  {
    name: 'Name',
    selector: (row) => row?.name,
    sortable: true,
  },
  {
    name: 'Start Date',
    selector: (row) => row.startDate?.slice(0, 10),
    sortable: true,
  },
  {
    name: 'End Date',
    selector: (row) => row.endDate?.slice(0, 10),
    sortable: true,
  },
];

const SeasonManage = () => {
  const fields = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      name: 'name',
    },
    {
      id: 'startDate',
      label: 'Start Date',
      type: 'date',
      name: 'startDate',
      placeholder: 'Select Start Date',
      isPortal: false,
    },
    {
      id: 'endDate',
      label: 'End Date',
      type: 'date',
      name: 'endDate',
      placeholder: 'Select End Date',
      isPortal: false,
    },
  ];
  return (
    <div className='space-y-6'>
      <BackButton />
      <div>
        <div className='text-heading2-bold'>Seasons</div>
        <p className='text-sm text-muted-foreground'>Manage seasons.</p>
      </div>

      <Separator />
      <CrudPanel
        apiPath='season'
        columns={columns}
        fields={fields}
        title='Season'
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={seasonFormSchema}
        defaultValues={{
          name: '',
          startDate: '',
          endDate: '',
        }}
        isAction={true}
        isExpandable={false}
      />
    </div>
  );
};

export default SeasonManage;
