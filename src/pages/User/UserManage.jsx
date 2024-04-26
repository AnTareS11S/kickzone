import BackButton from '../../components/BackButton';
import DeleteUser from '../../components/admin/users/DeleteUser';
import RoleActions from '../../components/admin/users/RoleActions';
import UsersPanel from '../../components/admin/users/UsersPanel';
import { Separator } from '../../components/ui/separator';

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
      <BackButton />
      <div>
        <div className='text-heading2-bold'>Users</div>
        <p className='text-sm text-muted-foreground'>Manage users.</p>
      </div>
      <Separator />
      <UsersPanel columns={columns} />
    </div>
  );
};

export default UserManage;
