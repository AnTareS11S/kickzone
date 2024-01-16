/* eslint-disable react/prop-types */
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

  const fieldsWithSelect = fields.filter((field) => field.type === 'select');

  fieldsWithSelect.forEach((selectField) => {
    if (selectField && selectField.items) {
      const matchingItem = selectField.items.find((item) => {
        return (
          (selectField.name === 'country' &&
            item.split(':')[1] === row.country) ||
          (selectField.name === 'stadium' &&
            item.split(':')[1] === row.stadium) ||
          (selectField.name === 'coach' &&
            item.split(':')[1] === row.coach?._id)
        );
      });
      selectField.defaultValue = matchingItem ? matchingItem.split(':')[0] : '';
    }
  });

  return (
    <div className='flex items-center space-x-4'>
      <ModalActions
        onSubmit={onSubmit}
        label='Edit'
        edit='true'
        title={`Edit ${
          apiEndpoint.toString().charAt(0).toUpperCase() +
          apiEndpoint.toString().slice(1)
        }`}
        desc={`Edit a ${apiEndpoint}`}
        data={row}
        fields={fields}
        form={form}
      />
    </div>
  );
};

export default EditEntity;
