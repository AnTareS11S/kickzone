import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';
import PageHeader from '../../components/PageHeader';
import { z } from 'zod';

const contactSchema = () =>
  z.object({
    name: z.string().min(3, 'Name is required'),
    lastName: z.string().min(3, 'Last name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(3, 'Phone is required'),
    address: z.string().min(3, 'Address is required'),
    active: z.boolean(),
  });

const ContactManage = () => {
  const columns = [
    {
      name: 'No.',
      selector: (row, index) => index + 1,
      grow: 0,
    },
    {
      name: 'Name',
      selector: (row) => row.name + ' ' + row.lastName,
      sortable: true,
    },
    {
      name: 'E-mail',
      selector: (row) => row.email,
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
      id: 'name',
      label: 'Name',
      type: 'text',
      name: 'name',
    },
    {
      id: 'lastName',
      label: 'Last Name',
      type: 'text',
      name: 'lastName',
    },
    {
      id: 'email',
      label: 'E-mail',
      type: 'email',
      name: 'email',
    },
    {
      id: 'phone',
      label: 'Phone',
      type: 'text',
      name: 'phone',
    },
    {
      id: 'address',
      label: 'Address',
      type: 'text',
      name: 'address',
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
      <PageHeader title='Contact' description='Manage contact information' />
      <CrudPanel
        apiPath='contact'
        columns={columns}
        fields={fields}
        title='Contact'
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={contactSchema}
        defaultValues={{
          name: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          active: true,
        }}
        isExpandable={false}
        isAction={true}
      />
    </div>
  );
};

export default ContactManage;
