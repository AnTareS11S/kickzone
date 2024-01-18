/* eslint-disable react/prop-types */
import CrudPanel from '../CrudPanel';
import DeleteEntity from '../DeleteEntity';
import * as z from 'zod';
import { useFetchTeamPlayers } from '../hooks/useFetchTeamPlayers';

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
  const id = data?._id;
  const players = useFetchTeamPlayers();

  const fields = [
    {
      id: 'player',
      label: 'Player',
      type: 'select',
      name: 'player',
      items: players,
      defaultValue: '',
      placeholder: 'Select a Player',
      idFlag: true,
    },
  ];
  return (
    <>
      {id && (
        <CrudPanel
          apiPath={`team-player/${id}`}
          columns={columns}
          fields={fields}
          title='Player'
          onDeleteComponent={DeleteEntity}
          formSchema={playerAddFormSchema}
          defaultValues={{
            player: '',
          }}
        />
      )}
    </>
  );
};

export default SquadManagement;
