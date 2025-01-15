import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';
import { z } from 'zod';
import PageHeader from '../../components/PageHeader';

const forumSchema = () =>
  z.object({
    name: z.string().min(3, 'Name is required').max(30, 'Name is too long'),
    description: z
      .string()
      .min(3, 'Description is required')
      .max(200, 'Description is too long'),
    isActive: z.boolean(),
  });

const ForumCategory = () => {
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
      name: 'Active',
      selector: (row) => (row.isActive ? 'Yes' : 'No'),
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
      id: 'description',
      label: 'Description',
      type: 'textarea',
      name: 'description',
    },
    {
      id: 'isActive',
      label: 'Active',
      type: 'checkbox',
      name: 'isActive',
    },
  ];

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Forum Categories'
        description='Manage Team Forum Categories'
      />
      <CrudPanel
        apiPath='team-forum-categories'
        columns={columns}
        fields={fields}
        title='Forum Category'
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={forumSchema}
        defaultValues={{
          name: '',
          description: '',
          isActive: true,
        }}
        isExpandable={false}
        isAction={true}
      />
    </div>
  );
};

export default ForumCategory;
