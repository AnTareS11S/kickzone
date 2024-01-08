import PlayersPanel from '../../components/admin/players/PlayersPanel';
import { Separator } from '../../components/ui/separator';

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
    name: 'Email',
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: 'Role',
    selector: (row) => row.role,
    sortable: true,
  },
  {
    name: 'Actions',
    cell: (row) => (
      <>
        <button
          className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
          onClick={() => console.log(row)}
        >
          Edit
        </button>
      </>
    ),
  },
];

const PlayerManage = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Players</h3>
        <p className='text-sm text-muted-foreground'>Manage players.</p>
      </div>
      <Separator />
      <PlayersPanel columns={columns} />
    </div>
  );
};

export default PlayerManage;
