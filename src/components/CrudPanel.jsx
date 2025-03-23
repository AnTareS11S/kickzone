/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomDataTable from './CustomDataTable';
import ModalActions from './ModalActions';
import { useToast } from './ui/use-toast';
import { useSocket } from '../hook/useSocket';

const CrudPanel = ({
  apiPath,
  columns,
  fields,
  title,
  onEditComponent: EditComponent,
  onDeleteComponent: DeleteComponent,
  onAddTeamComponent: AddTeamComponent,
  onRemoveTeamComponent: RemoveTeamComponent,
  onSendMessageComponent: SendMessageComponent,
  defaultValues,
  formSchema = () => {},
  isExpandable,
  objectId,
  teamId,
  isAction,
  ...rest
}) => {
  const [data, setData] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [file, setFile] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { emit } = useSocket();

  const form = useForm({
    resolver: zodResolver(formSchema(false)),
    defaultValues: { ...defaultValues },
    mode: 'onChange',
  });

  const fetchData = async () => {
    try {
      const endpoint = objectId ? `${apiPath}/${objectId}` : apiPath;
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/${endpoint}`
      );
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
    setIsLoading(true);
    const formData = new FormData();
    for (const key in data) {
      if (key === 'logo') {
        formData.append(key, file || data.logo);
      } else {
        formData.append(key, data[key]);
      }
    }

    if (apiPath === 'training') {
      emit('initializeTeamTrainingNotifications', {
        teamId: teamId,
      });
    }

    try {
      if (
        ['team', 'league', 'country', 'season', 'position', 'stadium'].includes(
          apiPath
        )
      ) {
        let url = `${
          import.meta.env.VITE_API_BASE_URL
        }/api/${apiPath}/check-${apiPath}-name?name=${data.name}`;

        if (apiPath === 'league') {
          url += `&season=${data.season}`;
        }
        const nameExists = await fetch(url);
        const nameData = await nameExists.json();

        if (nameData.exists) {
          form.setError('name', {
            type: 'manual',
            message: `${title} name already exists`,
          });
          toast({
            title: 'Error!',
            description: `${title} name already exists`,
            variant: 'destructive',
          });
          setUpdateSuccess(false);
          setIsLoading(false);
          return;
        }
      }

      const endpoint = objectId ? `${apiPath}/${objectId}` : apiPath;
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/${endpoint}/add`,
        {
          method: 'POST',
          body: formData,
        }
      );
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
    } finally {
      setIsLoading(false);
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
          form={form}
          fields={fields}
          isLoading={isLoading}
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
                      title={title}
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
                  {SendMessageComponent && (
                    <SendMessageComponent
                      row={row}
                      onEntityUpdated={handleEntityUpdated}
                    />
                  )}
                  {DeleteComponent && (
                    <DeleteComponent
                      row={row}
                      onEntityDelete={handleEntityUpdated}
                      apiEndpoint={apiPath}
                      title={title}
                    />
                  )}
                </div>
              );
            },
            grow: RemoveTeamComponent || SendMessageComponent ? 0.5 : 0,
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
