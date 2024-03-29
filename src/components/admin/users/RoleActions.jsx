import { useForm } from 'react-hook-form';
import { Form } from '../../ui/form';
import FormArea from '../../FormArea';

const RoleActions = ({ row }) => {
  const role = row.role;

  const form = useForm({
    defaultValues: {
      role,
    },
  });

  const roles = ['user:1', 'admin:2', 'coach:3', 'referee:4', 'player:5'];

  const id = row._id;

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
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
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
