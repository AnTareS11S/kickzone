import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';
import { z } from 'zod';
import PageHeader from '../../components/PageHeader';

const privacySchema = () =>
  z.object({
    term: z.string().min(3, 'Term is required'),
    content: z.string().min(3, 'Content is required'),
    active: z.boolean(),
  });

const PrivacyManage = () => {
  const columns = [
    {
      name: 'No.',
      selector: (row, index) => index + 1,
      grow: 0,
    },
    {
      name: 'Term',
      selector: (row) => row.term,
      sortable: true,
    },
    {
      name: 'Active',
      selector: (row) => (row.active ? 'Yes' : 'No'),
      sortable: true,
    },
  ];

  const fields = [
    {
      id: 'term',
      label: 'Term',
      type: 'text',
      name: 'term',
    },
    {
      id: 'content',
      label: 'Content',
      type: 'textarea',
      name: 'content',
    },
    {
      id: 'active',
      label: 'Active',
      type: 'checkbox',
      name: 'active',
    },
  ];

  return (
    <div className='space-y-6'>
      <PageHeader title='Privacy Policy' description='Manage privacy policy ' />
      <CrudPanel
        apiPath='privacy'
        columns={columns}
        fields={fields}
        title='Privacy'
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={privacySchema}
        defaultValues={{
          term: '',
          content: '',
          active: true,
        }}
        isExpandable={false}
        isAction={true}
      />
    </div>
  );
};

export default PrivacyManage;
