import BackButton from '../../components/BackButton';
import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';

import { Separator } from '../../components/ui/separator';
import { positionFormSchema } from '../../lib/validation/PositionValidation';

const PositionManage = () => {
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
    {
      name: 'Shortcut',
      selector: (row) => row.shortcut,
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
    {
      id: 'shortcut',
      label: 'Shortcut',
      type: 'text',
      name: 'shortcut',
    },
  ];

  return (
    <div className='space-y-6'>
      <BackButton />
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
        defaultValues={{ name: '', shortcut: '' }}
        isExpandable={false}
        isAction={true}
      />
    </div>
  );
};

export default PositionManage;
