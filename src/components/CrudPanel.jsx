/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomDataTable from './CustomDataTable';
import ModalActions from './ModalActions';

const CrudPanel = ({
  apiPath,
  columns,
  fields,
  title,
  onEditComponent: EditComponent,
  onDeleteComponent: DeleteComponent,
  defaultValues,
  formSchema,
}) => {
  const [data, setData] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema(false)),
    defaultValues: { ...defaultValues },
    mode: 'onChange',
  });

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/${apiPath}`);
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    setUpdateSuccess(false);
  }, [updateSuccess]);

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/admin/${apiPath}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error('Failed to fetch data!');
      }

      setUpdateSuccess(true);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEntityUpdated = () => {
    fetchData();
  };

  return (
    <>
      <ModalActions
        label='Add'
        onSubmit={onSubmit}
        title={`Add ${title}`}
        desc={`Add a new ${title}`}
        form={form}
        fields={fields}
      />
      <CustomDataTable
        columns={[
          ...columns,
          {
            name: 'Actions',
            cell: (row) => (
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
                {DeleteComponent && (
                  <DeleteComponent
                    row={row}
                    onEntityDelete={handleEntityUpdated}
                    apiEndpoint={apiPath}
                  />
                )}
              </div>
            ),
            grow: 0,
          },
        ]}
        data={data}
        pagination
        pending
      />
    </>
  );
};

export default CrudPanel;