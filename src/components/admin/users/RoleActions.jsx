/* eslint-disable react/prop-types */
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '../../ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

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
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder={role} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default RoleActions;
