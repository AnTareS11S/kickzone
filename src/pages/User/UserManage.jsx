import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import PageHeader from '../../components/PageHeader';
import SetRole from '../../components/admin/users/SetRole';
import { roleFormSchema } from '../../lib/validation/UsersValidation';

const columns = [
  {
    name: 'No.',
    selector: (row, index) => index + 1,
    grow: 0,
  },
  {
    name: 'Username',
    cell: (row) => row.username,
    sortable: true,
  },
  {
    name: 'Email',
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: 'Role',
    cell: (row) => row.role,
    grow: 0.5,
  },
  {
    name: 'Created At',
    selector: (row) => {
      const date = new Date(row.createdAt);
      return <div className=''>{date.toLocaleDateString()}</div>;
    },
    grow: 0.5,
  },
];

const UserManage = () => {
  return (
    <div className='space-y-6'>
      <PageHeader title='Users' description='Manage users' />
      <CrudPanel
        apiPath='user'
        columns={columns}
        title='User'
        onSetRoleComponent={SetRole}
        onDeleteComponent={DeleteEntity}
        formSchema={roleFormSchema}
        defaultValues={{
          role: '',
        }}
        isExpandable={false}
        isAction={true}
      />
    </div>
  );
};

export default UserManage;
