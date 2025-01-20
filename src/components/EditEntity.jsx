import { useState } from 'react';
import ModalActions from './ModalActions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from './ui/use-toast';
import { TbLoader2 } from 'react-icons/tb';

const EditEntity = ({
  row,
  onEntityUpdated,
  apiEndpoint,
  formSchema,
  fields,
  title,
  defaultValues,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema(true)),
    defaultValues: { ...defaultValues },
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
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
          setIsLoading(false);
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
        onEntityUpdated();
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
      toast({
        title: 'Error!',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFieldDefaults = (fields, row) => {
    return fields.map((field) => {
      if (field.type === 'select') {
        const matchingItem =
          field.items.find((item) => item.id === row[field.name]) ||
          field.items.find((item) => item.name === row[field.name]);

        field.defaultValue = matchingItem
          ? matchingItem.name
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
        title={`Edit ${title}`}
        data={row}
        fields={updatedFields}
        form={form}
        setFile={setFile}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOpen={() => setIsModalOpen(true)}
        isLoading={isLoading}
        loadingIcon={<TbLoader2 className='w-4 h-4 animate-spin' />}
      />
    </div>
  );
};

export default EditEntity;
