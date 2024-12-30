import CrudPanel from '../../components/CrudPanel';
import EditEntity from '../../components/EditEntity';
import DeleteEntity from '../../components/DeleteEntity';
import { trainingValidationSchema } from '../../lib/validation/TrainingValidation';
import { useEffect, useState } from 'react';
import { useFetchCoachByUserId } from '../../components/hooks/useFetchCoachByUserId';
import PageHeader from '../../components/PageHeader';

const columns = [
  {
    name: 'No.',
    selector: (row, index) => index + 1,
    grow: 0,
  },
  {
    name: 'Training',
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: 'Duration',
    selector: (row) => row.duration,
    sortable: true,
  },
  {
    name: 'Training Date',
    selector: (row) => row.trainingDate?.slice(0, 10),
    sortable: true,
  },
  {
    name: 'Location',
    selector: (row) => row.location,
    sortable: true,
  },
];

const TrainingManage = () => {
  const [types, setTypes] = useState([]);
  const { coach } = useFetchCoachByUserId();

  useEffect(() => {
    const getTypes = async () => {
      try {
        if (!coach?._id) return;
        const res = await fetch(`/api/admin/training-type/${coach?._id}`);
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch data!');
        }
        const data = await res.json();
        setTypes(data.map((type) => type.name + ':' + type._id));
      } catch (error) {
        console.log(error);
      }
    };

    getTypes();
  }, [coach?._id]);

  const fields = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      name: 'name',
    },
    {
      id: 'trainingType',
      label: 'Training Type',
      type: 'select',
      name: 'trainingType',
      items: types,
      placeholder: 'Select a Type',
      idFlag: true,
    },
    {
      id: 'trainingDate',
      label: 'Training Date',
      type: 'date',
      name: 'trainingDate',
      placeholder: 'Select a Date',
      time: true,
      isPortal: false,
    },
    {
      id: 'duration',
      label: 'Duration (in minutes)',
      type: 'number',
      name: 'duration',
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      name: 'description',
    },

    {
      id: 'location',
      label: 'Location',
      type: 'text',
      name: 'location',
    },
    {
      id: 'notes',
      label: 'Notes',
      type: 'textarea',
      name: 'notes',
    },
    {
      id: 'equipment',
      label: 'Equipment',
      type: 'textarea',
      name: 'equipment',
    },
  ];

  return (
    <div className='space-y-6'>
      <PageHeader title='Trainings' description='Manage trainings' />
      <CrudPanel
        apiPath='training'
        columns={columns}
        fields={fields}
        title='Training'
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={trainingValidationSchema}
        teamId={coach?.currentTeam}
        objectId={coach?._id}
        isAction={true}
        isExpandable={false}
        defaultValues={{
          name: '',
          trainingType: '',
          trainingDate: '',
          duration: '',
          description: '',
          location: '',
          notes: '',
          equipment: '',
        }}
      />
    </div>
  );
};

export default TrainingManage;
