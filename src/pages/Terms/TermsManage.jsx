import BackButton from '../../components/BackButton';
import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';

import { Separator } from '../../components/ui/separator';
import { z } from 'zod';

const termsSchema = () =>
  z.object({
    term: z.string().min(3, 'Term is required'),
    definition: z.string().min(3, 'Definition is required'),
  });

const TermsManage = () => {
  const columns = [
    {
      name: 'No.',
      selector: (row, index) => index + 1,
      grow: 0,
    },
    {
      name: 'Term',
      selector: (row) => row.term,
      sortable: true,
    },
  ];

  const fields = [
    {
      id: 'term',
      label: 'Term',
      type: 'text',
      name: 'term',
    },
    {
      id: 'definition',
      label: 'Definition',
      type: 'textarea',
      name: 'definition',
    },
  ];

  return (
    <div className='space-y-6'>
      <BackButton />
      <div>
        <div className='text-heading2-bold'>Terms</div>
        <p className='text-sm text-muted-foreground'>Manage terms</p>
      </div>
      <Separator />
      <CrudPanel
        apiPath='terms'
        columns={columns}
        fields={fields}
        title='Terms'
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={termsSchema}
        defaultValues={{
          term: '',
          definition: '',
        }}
        isExpandable={false}
        isAction={true}
      />
    </div>
  );
};

export default TermsManage;
