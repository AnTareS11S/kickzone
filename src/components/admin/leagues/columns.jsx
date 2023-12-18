import { Button } from '../../ui/button';
import { CaretSortIcon } from '@radix-ui/react-icons';
import EditLeague from './EditLeague';
import DeleteLeague from './DeleteLeague';
import AddTeam from './AddTeam';

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
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div className='flex items-center space-x-4'>
          <EditLeague row={row} />
          <AddTeam row={row} />
          <DeleteLeague row={row} />
        </div>
      );
    },
  },
];
