/* eslint-disable react/prop-types */
import { useForm } from 'react-hook-form';
import { Form } from '../../ui/form';

import FormArea from '../../FormArea';

const RoleActions = ({ row }) => {
  const role = row.getValue('role');

  const form = useForm({
    defaultValues: {
      role,
    },
  });

  const roles = ['user', 'admin', 'coach', 'referee'];

  const id = row.original._id;

  const handleRoleChange = async (e) => {
    const newRole = e.target.value;

    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch data!');
      }
      const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onChange={(e) => handleRoleChange(e)}>
        <FormArea
          type='select'
          form={form}
          items={roles}
          placeholder={role}
          name='role'
        />
      </form>
    </Form>
  );
};

export default RoleActions;
