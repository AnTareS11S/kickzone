import { Button } from '../../ui/button';
import { CaretSortIcon } from '@radix-ui/react-icons';
import EditLeague from './EditLeague';
import DeleteLeague from './DeleteLeague';
import AddTeam from './AddTeam';
import RemoveTeamFromLeague from './RemoveTeamFromLeague';

export const columns = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <CaretSortIcon className='w-4 h-4 ml-2' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'country',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Country
          <CaretSortIcon className='w-4 h-4 ml-2' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'teams',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Teams
          <CaretSortIcon className='w-4 h-4 ml-2' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue('teams').toString().split(',')[0];
      return <div>{value}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const teams = row?.original.teams.toString().split(',').slice(1);
      return (
        <div className='flex items-center space-x-4'>
          <EditLeague row={row} />
          <AddTeam row={row} />
          <RemoveTeamFromLeague row={row} teams={teams} />
          <DeleteLeague row={row} />
        </div>
      );
    },
  },
];
