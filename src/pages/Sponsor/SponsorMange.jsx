import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';
import PageHeader from '../../components/PageHeader';
import { sponsorFormSchema } from '../../lib/validation/SponsorValidation';

const SponsorManage = () => {
  const columns = [
    {
      name: 'No.',
      selector: (row, index) => index + 1,
      grow: 0,
    },
    {
      name: 'Sponsor',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Website',
      selector: (row) => row.website,
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
      id: 'logo',
      label: 'Logo',
      type: 'file',
      name: 'logo',
    },
    {
      id: 'website',
      label: 'Website',
      type: 'text',
      name: 'website',
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      name: 'description',
    },
    {
      id: 'notes',
      label: 'Notes',
      type: 'textarea',
      name: 'notes',
    },
  ];
  return (
    <div className='space-y-6'>
      <PageHeader title='Sponsors' description='Manage sponsors' />
      <CrudPanel
        apiPath='sponsor'
        columns={columns}
        fields={fields}
        title='Sponsor'
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={sponsorFormSchema}
        defaultValues={{
          name: '',
          logo: '',
          website: '',
          description: '',
          notes: '',
        }}
        isExpandable={false}
        isAction={true}
      />
    </div>
  );
};

export default SponsorManage;
