import { useEffect, useState } from 'react';
import UsersPanel from '../components/admin/users/UsersPanel';
import { columns } from '../components/admin/users/columns';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch data!');
        }
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, []);
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Users</h3>
        <p className='text-sm text-muted-foreground'>Manage users.</p>
      </div>
      <UsersPanel columns={columns} data={users} />
    </div>
  );
};

export default Users;
