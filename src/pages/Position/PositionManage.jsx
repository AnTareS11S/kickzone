import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';
import PageHeader from '../../components/PageHeader';
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
      <PageHeader title='Position' description='Manage positions' />
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
