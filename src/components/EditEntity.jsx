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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const onSubmit = async (data) => {
    const formData = new FormData();

    for (const key in data) {
      if (key === 'logo' && !file) {
        formData.append(key, file || row.logo);
      } else {
        formData.append(key, data[key]);
      }
    }

    try {
      if (
        ['team', 'league', 'country', 'season', 'position', 'stadium'].includes(
          apiEndpoint
        )
      ) {
        let url = `/api/${apiEndpoint}/check-${apiEndpoint}-name?name=${data.name}&id=${row._id}`;

        if (apiEndpoint === 'league') {
          url += `&season=${data.season}`;
        }
        const nameExists = await fetch(url);
        const nameData = await nameExists.json();

        if (nameData.exists) {
          form.setError('name', {
            type: 'manual',
            message: `${data.name} already exists ${
              apiEndpoint === 'league' ? 'for this season' : ''
            }`,
          });
          toast({
            title: 'Error!',
            description: `Name ${data?.name} already exists ${
              apiEndpoint === 'league' ? 'for this season' : ''
            }`,
            variant: 'destructive',
          });
          setUpdatedSuccess(false);
          return;
        }
      }

      const res = await fetch(`/api/admin/${apiEndpoint}/edit/${row._id}`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        toast({
          title: 'Success!',
          description: `${row?.name} updated successfully`,
        });
        setUpdatedSuccess(true);
        setIsModalOpen(false);
      } else {
        toast({
          title: 'Error!',
          description: `Failed to update ${row?.name}`,
          variant: 'destructive',
        });
      }
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

        field.defaultValue = matchingItem
          ? matchingItem.split(':')[0]
          : `Select ${field.label}`;
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOpen={() => setIsModalOpen(true)}
      />
    </div>
  );
};

export default EditEntity;
