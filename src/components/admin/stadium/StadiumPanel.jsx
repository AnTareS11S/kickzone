/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import CustomDataTable from '../../CustomDataTable';
import ModalActions from '../../ModalActions';

import EditStadium from './EditStadium';
import DeleteStadium from './DeleteStadium';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stadiumFormSchema } from '../../../lib/validation/StadiumValidation';
import { useFetchCountries } from '../../hooks/useFetchCountries';

const StadiumPanel = () => {
  const [stadiums, setStadiums] = useState([]);
  const countries = useFetchCountries();
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(stadiumFormSchema(false)),
    defaultValues: {
      name: '',
      capacity: '',
      country: '',
      city: '',
      location: '',
      history: '',
    },
    mode: 'onChange',
  });

  const columns = [
    {
      name: 'No.',
      selector: (row, index) => index + 1,
      grow: 0,
    },
    {
      name: 'Stadium',
      selector: (row) => row.name,
      sortable: true,
    },

    {
      name: 'Actions',
      cell: (row) => {
        return (
          <div className='flex items-center space-x-4'>
            <EditStadium row={row} onStadiumUpdated={handleStadiumUpdated} />
            <DeleteStadium row={row} onStadiumUpdated={handleStadiumUpdated} />
          </div>
        );
      },
      grow: 0,
    },
  ];

  const getStadiums = async () => {
    try {
      const res = await fetch('/api/admin/stadiums');
      const data = await res.json();
      setStadiums(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStadiums();

    setUpdateSuccess(false);
  }, [updateSuccess]);

  const fields = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      name: 'name',
    },
    {
      id: 'capacity',
      label: 'Capacity',
      type: 'number',
      name: 'capacity',
    },
    {
      id: 'country',
      label: 'Country',
      type: 'select',
      name: 'country',
      items: countries,
      placeholder: 'Select a Country',
      idFlag: true,
    },
    {
      id: 'city',
      label: 'City',
      type: 'text',
      name: 'city',
    },
    {
      id: 'location',
      label: 'Location',
      type: 'text',
      name: 'location',
    },
    {
      id: 'history',
      label: 'History',
      type: 'textarea',
      name: 'history',
    },
  ];

  const onSubmit = async (formData) => {
    try {
      const res = await fetch('/api/admin/stadium/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch data!');
      }
      const data = await res.json();
      setUpdateSuccess(true);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleStadiumUpdated = () => {
    getStadiums();
  };

  return (
    <>
      <ModalActions
        label='Add'
        onSubmit={onSubmit}
        title='Add Stadium'
        desc='Add a new stadium'
        form={form}
        fields={fields}
      />
      <CustomDataTable columns={columns} data={stadiums} pagination pending />
    </>
  );
};

export default StadiumPanel;
