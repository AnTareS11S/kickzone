import BackButton from '../../components/BackButton';
import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';

import { Separator } from '../../components/ui/separator';
import { z } from 'zod';

const aboutSchema = (isEdit) =>
  z.object({
    title: z.string().min(3, 'Title is required'),
    description: z.string().min(3, 'Description is required'),
    mission: z.string().min(3, 'Mission is required'),
    whyUs: z.string().min(3, 'Why Us is required'),
    logo: isEdit
      ? z.any().nullable()
      : z.instanceof(File, {
          message: 'Logo is required',
        }),
  });

const AboutUsManage = () => {
  const columns = [
    {
      name: 'No.',
      selector: (row, index) => index + 1,
      grow: 0,
    },
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
    },
  ];

  const fields = [
    {
      id: 'title',
      label: 'Title',
      type: 'text',
      name: 'title',
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      name: 'description',
    },
    {
      id: 'mission',
      label: 'Mission',
      type: 'textarea',
      name: 'mission',
    },
    {
      id: 'whyUs',
      label: 'Why Us',
      type: 'textarea',
      name: 'whyUs',
    },
    {
      id: 'logo',
      label: 'Photo',
      type: 'file',
      name: 'logo',
    },
  ];

  return (
    <div className='space-y-6'>
      <BackButton />
      <div>
        <div className='text-heading2-bold'>About Us</div>
        <p className='text-sm text-muted-foreground'>Manage about us</p>
      </div>
      <Separator />
      <CrudPanel
        apiPath='about'
        columns={columns}
        fields={fields}
        title='About Us'
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={aboutSchema}
        defaultValues={{
          title: '',
          description: '',
          mission: '',
          whyUs: '',
          logo: '',
        }}
        isExpandable={false}
        isAction={true}
      />
    </div>
  );
};

export default AboutUsManage;
