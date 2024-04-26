import { useState } from 'react';
import ModalActions from './ModalActions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOnSuccessUpdate } from './hooks/useOnSuccessUpdate';

const EditEntity = ({
  row,
  onEntityUpdated,
  apiEndpoint,
  formSchema,
  fields,
  defaultValues,
}) => {
  const [updatedSuccess, setUpdatedSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema(true)),
    defaultValues: { ...defaultValues },
    mode: 'onChange',
  });

  useOnSuccessUpdate(updatedSuccess, () => {
    onEntityUpdated();
    setUpdatedSuccess(false);
  });

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/admin/${apiEndpoint}/edit/${row._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch data!');
      }
      setUpdatedSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

  const updateFieldDefaults = (fields, row) => {
    return fields.map((field) => {
      if (field.type === 'select') {
        const matchingItem = field.items.find(
          (item) => item.split(':')[1] === row[field.name]
        );
        field.defaultValue = matchingItem ? matchingItem.split(':')[0] : '';
      } else if (field.type === 'date') {
        field.initialDate = row[field.name] ? new Date(row[field.name]) : null;
      }
      return field;
    });
  };

  const updatedFields = updateFieldDefaults([...fields], row);

  return (
    <div className='flex items-center space-x-4'>
      <ModalActions
        onSubmit={onSubmit}
        label='Edit'
        edit={true}
        title={`Edit ${
          apiEndpoint.toString().charAt(0).toUpperCase() +
          apiEndpoint.toString().slice(1)
        }`}
        desc={`Edit a ${apiEndpoint}`}
        data={row}
        fields={updatedFields}
        form={form}
      />
    </div>
  );
};

export default EditEntity;
