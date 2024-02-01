import DeleteUser from '../../components/admin/users/DeleteUser';
import RoleActions from '../../components/admin/users/RoleActions';
import UsersPanel from '../../components/admin/users/UsersPanel';
import { Separator } from '../../components/ui/separator';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  return (
    <div className='space-y-6'>
      <div
        className='cursor-pointer mb-2 inline-flex items-center justify-center bg-primary-500 hover:bg-purple-500 text-white font-bold py-1 px-3 rounded'
        onClick={() => navigate(-1)}
      >
        <span className='mr-1'>&#8592;</span> Back
      </div>
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
