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
          className='cursor-pointer flex items-center'
        >
          Username
          <CaretSortIcon className='w-4 h-4 ml-2' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className='font-medium'>{row.getValue('username')}</div>;
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer flex items-center'
        >
          Email
          <CaretSortIcon className='w-4 h-4 ml-2' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className='lowercase w-1'>{row.getValue('email')}</div>;
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Role
          <CaretSortIcon className='w-4 h-4 ml-2' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className=''>
        {' '}
        <RoleActions row={row} />
      </div>
    ),
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <CaretSortIcon className='w-4 h-4 ml-2' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <div className=''>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <DeleteUser row={row} />,
  },
];
