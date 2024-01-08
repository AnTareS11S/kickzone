import UsersPanel from '../components/admin/users/UsersPanel';
import { Separator } from '../components/ui/separator';
import RoleActions from '../components/admin/users/RoleActions';
import DeleteUser from '../components/admin/users/DeleteUser';

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
    cell: (row) => <RoleActions row={row} />,
  },
  {
    name: 'Created At',
    selector: (row) => {
      const date = new Date(row.createdAt);
      return <div className=''>{date.toLocaleDateString()}</div>;
    },
  },

  {
    name: 'Actions',
    cell: (row) => <DeleteUser row={row} />,
    grow: 0,
  },
];

const UserManage = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Users</h3>
        <p className='text-sm text-muted-foreground'>Manage users.</p>
      </div>
      <Separator />
      <UsersPanel columns={columns} />
    </div>
  );
};

export default UserManage;
