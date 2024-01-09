import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';
import { useFetchCountries } from '../../components/hooks/useFetchCountries';

import { Separator } from '../../components/ui/separator';
import { stadiumFormSchema } from '../../lib/validation/StadiumValidation';

const StadiumManage = () => {
  const countries = useFetchCountries();

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
  ];

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
      defaultValue: '',
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

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Stadiums</h3>
        <p className='text-sm text-muted-foreground'>Manage stadiums.</p>
      </div>
      <Separator />
      <CrudPanel
        apiPath='stadium'
        columns={columns}
        fields={fields}
        title='Stadium'
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={stadiumFormSchema}
        defaultValues={{
          name: '',
          capacity: '',
          country: '',
          city: '',
          location: '',
          history: '',
        }}
      />
    </div>
  );
};

export default StadiumManage;
