/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import CustomDataTable from '../../CustomDataTable';
import ModalActions from '../../ModalActions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { countryFormSchema } from '../../../lib/validation/CountryValidation';
import EditCountry from './EditCountry';
import DeleteCountry from './DeleteCountry';

const CountryPanel = () => {
  const [countries, setCountries] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(countryFormSchema(false)),
    defaultValues: {
      name: '',
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
      name: 'Country',
      selector: (row) => row.name,
      sortable: true,
    },

    {
      name: 'Actions',
      cell: (row) => {
        return (
          <div className='flex items-center space-x-4'>
            <EditCountry row={row} onCountryUpdated={handleCountryUpdated} />
            <DeleteCountry row={row} onCountryUpdated={handleCountryUpdated} />
          </div>
        );
      },
      grow: 0,
    },
  ];

  const getCountries = async () => {
    try {
      const res = await fetch('/api/admin/countries');
      const data = await res.json();
      setCountries(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCountries();
    setUpdateSuccess(false);
  }, [updateSuccess]);

  const fields = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      name: 'name',
    },
  ];

  const onSubmit = async (formData) => {
    try {
      const res = await fetch('/api/admin/country/add', {
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

  const handleCountryUpdated = () => {
    getCountries();
  };

  return (
    <>
      <ModalActions
        label='Add'
        onSubmit={onSubmit}
        title='Add Country'
        desc='Add a new country'
        form={form}
        fields={fields}
      />
      <CustomDataTable columns={columns} data={countries} pagination pending />
    </>
  );
};

export default CountryPanel;
