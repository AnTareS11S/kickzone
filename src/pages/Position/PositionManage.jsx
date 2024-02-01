import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';

import { Separator } from '../../components/ui/separator';
import { positionFormSchema } from '../../lib/validation/PositionValidation';
import { useNavigate } from 'react-router-dom';

const PositionManage = () => {
  const navigate = useNavigate();
  const columns = [
    {
      name: 'No.',
      selector: (row, index) => index + 1,
      grow: 0,
    },
    {
      name: 'Position',
      selector: (row) => row.name,
      sortable: true,
    },
  ];

  const fields = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      name: 'name',
    },
  ];

  return (
    <div className='space-y-6'>
      <div
        className='cursor-pointer mb-2 inline-flex items-center justify-center bg-primary-500 hover:bg-purple-500 text-white font-bold py-1 px-3 rounded'
        onClick={() => navigate(-1)}
      >
        <span className='mr-1'>&#8592;</span> Back
      </div>
      <div>
        <div className='text-heading2-bold'>Positions</div>
        <p className='text-sm text-muted-foreground'>Manage positions.</p>
      </div>
      <Separator />
      <CrudPanel
        apiPath='position'
        columns={columns}
        fields={fields}
        title='Position'
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={positionFormSchema}
        defaultValues={{ name: '' }}
      />
    </div>
  );
};

export default PositionManage;
