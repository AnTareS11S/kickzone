import { useState } from 'react';
import ModalActions from './ModalActions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOnSuccessUpdate } from './hooks/useOnSuccessUpdate';
import { useToast } from './ui/use-toast';

const EditEntity = ({
  row,
  onEntityUpdated,
  apiEndpoint,
  formSchema,
  fields,
  defaultValues,
}) => {
  const [updatedSuccess, setUpdatedSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const { toast } = useToast();

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
    const data = new FormData();

    for (const key in formData) {
      if (key === 'logo' && !file) {
        data.append(key, file || row.logo);
        continue;
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const res = await fetch(`/api/admin/${apiEndpoint}/edit/${row._id}`, {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Team updated successfully',
        });
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update team',
          variant: 'destructive',
        });
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
        setFile={setFile}
      />
    </div>
  );
};

export default EditEntity;
