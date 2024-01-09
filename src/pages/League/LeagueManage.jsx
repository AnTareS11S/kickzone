import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';
import AddTeam from '../../components/admin/leagues/AddTeam';
import RemoveTeamFromLeague from '../../components/admin/leagues/RemoveTeamFromLeague';
import { useFetchCountries } from '../../components/hooks/useFetchCountries';
import { Separator } from '../../components/ui/separator';
import { leagueFormSchema } from '../../lib/validation/LeagueValidation';

const LeagueManage = () => {
  const countries = useFetchCountries();

  const columns = [
    {
      name: 'No.',
      selector: (row, index) => index + 1,
      grow: 0,
    },
    {
      name: 'League',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Teams',
      selector: (row) => row.teams.length,
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
      id: 'country',
      label: 'Country',
      type: 'select',
      name: 'country',
      items: countries,
      placeholder: 'Select a Country',
      idFlag: true,
    },
    {
      id: 'commissioner',
      label: 'Commissioner',
      type: 'text',
      name: 'commissioner',
    },
    {
      id: 'bio',
      label: 'Bio',
      type: 'textarea',
      name: 'bio',
    },
  ];
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Leagues</h3>
        <p className='text-sm text-muted-foreground'>Manage leagues.</p>
      </div>
      <Separator />
      <CrudPanel
        apiPath='league'
        columns={columns}
        fields={fields}
        title='League'
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        onAddTeamComponent={AddTeam}
        onRemoveTeamComponent={RemoveTeamFromLeague}
        formSchema={leagueFormSchema}
        defaultValues={{
          name: '',
          bio: '',
          commissioner: '',
          country: '',
        }}
      />
    </div>
  );
};

export default LeagueManage;
