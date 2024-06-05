/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomDataTable from './CustomDataTable';
import ModalActions from './ModalActions';
import { useToast } from './ui/use-toast';

const CrudPanel = ({
  apiPath,
  columns,
  fields,
  title,
  onEditComponent: EditComponent,
  onDeleteComponent: DeleteComponent,
  onAddTeamComponent: AddTeamComponent,
  onRemoveTeamComponent: RemoveTeamComponent,
  onSetRoleComponent: SetRoleComponent,
  defaultValues,
  formSchema,
  isExpandable,
  objectId,
  isAction,
  ...rest
}) => {
  const [data, setData] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [file, setFile] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema(false)),
    defaultValues: { ...defaultValues },
    mode: 'onChange',
  });

  const fetchData = async () => {
    try {
      const endpoint = objectId ? `${apiPath}/${objectId}` : apiPath;
      const res = await fetch(`/api/admin/${endpoint}`);
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    setUpdateSuccess(false);
  }, [updateSuccess, objectId]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === 'logo') {
        formData.append(key, file || data.logo);
      } else {
        formData.append(key, data[key]);
      }
    }

    try {
      if (['team', 'league', 'country'].includes(apiPath)) {
        const nameExists = await fetch(
          `/api/${apiPath}/check-${apiPath}-name?name=${data.name}`
        );
        const nameData = await nameExists.json();

        if (nameData.exists) {
          form.setError('name', {
            type: 'manual',
            message: 'Name already exists',
          });
          toast({
            title: 'Error!',
            description: `${title} already exists`,
            variant: 'destructive',
          });
          setUpdateSuccess(false);
          return;
        }
      }

      const endpoint = objectId ? `${apiPath}/${objectId}` : apiPath;
      const res = await fetch(`/api/admin/${endpoint}/add`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        toast({
          title: 'Success!',
          description: `${title} added successfully`,
        });
        setUpdateSuccess(true);
        form.reset();
        setIsModalOpen(false);
      } else {
        console.log(res.status, res.statusText);
        toast({
          title: 'Error!',
          description: `Failed to add ${title}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEntityUpdated = () => {
    fetchData();
  };

  return (
    <>
      {fields && (
        <ModalActions
          label='Add'
          onSubmit={onSubmit}
          title={`Add ${title}`}
          desc={`Add a new ${title}`}
          form={form}
          fields={fields}
          setFile={setFile}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onOpen={() => setIsModalOpen(true)}
        />
      )}
      <CustomDataTable
        columns={[
          ...columns,
          isAction && {
            name: 'Actions',
            cell: (row) => {
              const teams = row?.teams?.map((team) => team?._id);
              return (
                <div className='flex items-center space-x-4'>
                  {EditComponent && (
                    <EditComponent
                      row={row}
                      onEntityUpdated={handleEntityUpdated}
                      apiEndpoint={apiPath}
                      formSchema={formSchema}
                      fields={fields}
                      defaultValues={defaultValues}
                    />
                  )}
                  {AddTeamComponent && (
                    <AddTeamComponent
                      row={row}
                      onEntityUpdated={handleEntityUpdated}
                    />
                  )}
                  {RemoveTeamComponent && (
                    <RemoveTeamComponent
                      row={row}
                      teams={teams}
                      onEntityUpdated={handleEntityUpdated}
                    />
                  )}
                  {SetRoleComponent && (
                    <SetRoleComponent
                      row={row}
                      onEntityUpdated={handleEntityUpdated}
                    />
                  )}
                  {DeleteComponent && (
                    <DeleteComponent
                      row={row}
                      onEntityDelete={handleEntityUpdated}
                      apiEndpoint={apiPath}
                    />
                  )}
                </div>
              );
            },
            grow: RemoveTeamComponent ? 0.5 : 0,
          },
        ]}
        data={data}
        pagination
        pending
        isExpandable={isExpandable}
        {...rest}
      />
    </>
  );
};

export default CrudPanel;
