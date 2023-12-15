import { Button } from '../../ui/button';
import { CaretSortIcon } from '@radix-ui/react-icons';
import RoleActions from './RoleActions';
import DeleteUser from './DeleteUser';

export const columns = [
  {
    accessorKey: 'username',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Username
          <CaretSortIcon className='w-4 h-4 ml-2' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <CaretSortIcon className='w-4 h-4 ml-2' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className='lowercase'>{row.getValue('email')}</div>;
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <RoleActions row={row} />,
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='text-right'
        >
          Created At
          <CaretSortIcon className='w-4 h-4 ml-2' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <div className='text-right'>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <DeleteUser row={row} />,
  },
];
