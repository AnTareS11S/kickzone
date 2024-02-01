import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';
import { Separator } from '../../components/ui/separator';
import { countryFormSchema } from '../../lib/validation/CountryValidation';
import { useNavigate } from 'react-router-dom';

const CountryManage = () => {
  const navigate = useNavigate();
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
  ];

  const fields = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      name: 'name',
    },
  ];

  return (
    <div className='space-y-6'>
      <div
        className='cursor-pointer mb-2 inline-flex items-center justify-center bg-primary-500 hover:bg-purple-500 text-white font-bold py-1 px-3 rounded'
        onClick={() => navigate(-1)}
      >
        <span className='mr-1'>&#8592;</span> Back
      </div>
      <div>
        <div className='text-heading2-bold'>Countries</div>
        <p className='text-sm text-muted-foreground'>Manage countries.</p>
      </div>
      <Separator />
      <CrudPanel
        apiPath='country'
        columns={columns}
        fields={fields}
        title='Country'
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={countryFormSchema}
        defaultValues={{ name: '' }}
      />
    </div>
  );
};

export default CountryManage;
