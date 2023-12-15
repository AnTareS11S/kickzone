import { Button } from '../../ui/button';
import { CaretSortIcon } from '@radix-ui/react-icons';
import EditTeam from './EditTeam';
import DeleteTeam from './DeleteTeam';

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
    accessorKey: 'coach',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Coach
          <CaretSortIcon className='w-4 h-4 ml-2' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'league',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          League
          <CaretSortIcon className='w-4 h-4 ml-2' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'yearFounded',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Year Founded
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
          <EditTeam row={row} />
          <DeleteTeam row={row} />
        </div>
      );
    },
  },
];
