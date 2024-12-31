import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';
import { useFetchCountries } from '../../components/hooks/useFetchCountries';
import PageHeader from '../../components/PageHeader';
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
      <PageHeader title='Stadiums' description='Manage stadiums' />
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
          capacity: '0',
          country: '',
          city: '',
          location: '',
          history: '',
        }}
        isExpandable={false}
        isAction={true}
      />
    </div>
  );
};

export default StadiumManage;
