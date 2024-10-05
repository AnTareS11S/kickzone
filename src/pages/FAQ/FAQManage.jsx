import BackButton from '../../components/BackButton';
import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';
import { Separator } from '../../components/ui/separator';
import { z } from 'zod';

const faqSchema = () =>
  z.object({
    question: z.string().min(3, 'Question is required'),
    answer: z.string().min(3, 'Answer is required'),
    active: z.boolean(),
  });

const FAQManage = () => {
  const columns = [
    {
      name: 'No.',
      selector: (row, index) => index + 1,
      grow: 0,
    },
    {
      name: 'Question',
      selector: (row) => row.question,
      sortable: true,
    },
    {
      name: 'Active',
      selector: (row) => (row.active ? 'Yes' : 'No'),
      sortable: true,
    },
  ];

  const fields = [
    {
      id: 'question',
      label: 'Question',
      type: 'textarea',
      name: 'question',
    },
    {
      id: 'answer',
      label: 'Answer',
      type: 'textarea',
      name: 'answer',
    },
    {
      id: 'active',
      label: 'Active',
      type: 'checkbox',
      name: 'active',
    },
  ];

  return (
    <div className='space-y-6'>
      <BackButton />
      <div>
        <div className='text-heading2-bold'>FAQ</div>
        <p className='text-sm text-muted-foreground'>Manage FAQ.</p>
      </div>
      <Separator />
      <CrudPanel
        apiPath='faq'
        columns={columns}
        fields={fields}
        title='FAQ'
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={faqSchema}
        defaultValues={{
          question: '',
          answer: '',
          active: true,
        }}
        isExpandable={false}
        isAction={true}
      />
    </div>
  );
};

export default FAQManage;
