import CrudPanel from '../CrudPanel';
import DeleteEntity from '../DeleteEntity';
import * as z from 'zod';
import { useFetchTeamPlayersByWantedTeam } from '../hooks/useFetchTeamPlayersByWantedTeam';
import Spinner from '../Spinner';

const columns = [
  {
    name: 'No.',
    selector: (row, index) => index + 1,
    grow: 0,
  },
  {
    name: 'Name',
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: 'Surname',
    selector: (row) => row.surname,
    sortable: true,
  },
  {
    name: 'Nationality',
    selector: (row) => row.nationality,
    sortable: true,
  },
  {
    name: 'Position',
    selector: (row) => row.position,
    sortable: true,
  },
];

const playerAddFormSchema = () =>
  z.object({
    player: z.string().min(1, {
      message: 'Player is required',
    }),
  });

const SquadManagement = ({ data }) => {
  const { players, loading } = useFetchTeamPlayersByWantedTeam(data?._id);

  const fields = [
    {
      id: 'player',
      label: 'Player',
      type: 'select',
      name: 'player',
      items: players,
      placeholder: 'Select a Player',
      idFlag: true,
    },
  ];

  if (loading) {
    return <Spinner />;
  }

  return (
    <CrudPanel
      apiPath={`team-player/${data?._id}`}
      columns={columns}
      fields={fields}
      title='Player'
      onDeleteComponent={DeleteEntity}
      formSchema={playerAddFormSchema}
      isExpandable={false}
      isAction={true}
      defaultValues={{
        player: '',
      }}
    />
  );
};

export default SquadManagement;
