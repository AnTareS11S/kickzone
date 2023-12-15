/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Input } from '../../ui/input';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '../../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import ModalActions from '../../ModalActions';

const TeamsPanel = ({ columns }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [coaches, setCoaches] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchDataForTable = async () => {
      try {
        const res = await fetch('/api/admin/teams');
        const data = await res.json();
        if (data.success === false) {
          console.log(data);
          return;
        }
        setTableData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataForTable();
  }, [updateSuccess]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await fetch('/api/admin/coaches');
        const data = await res.json();
        setCoaches(
          data.map(
            (coach) => coach.name + ' ' + coach.surname + ':' + coach._id
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchCoaches();
  }, []);

  const onSubmit = async (formData) => {
    try {
      const res = await fetch('/api/team/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUpdateSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='flex items-center py-4 justify-between'>
        <Input
          placeholder='Search teams...'
          className='max-w-sm'
          value={table.getColumn('name')?.getFilterValue() ?? ''}
          onChange={(e) =>
            table.getColumn('name').setFilterValue(e.target.value)
          }
        />
        <ModalActions
          onSubmit={onSubmit}
          label='Add Team'
          title='Add Team'
          desc='Add a new team'
          teamData={tableData}
          coaches={coaches}
          updateSuccess={updateSuccess}
        />
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No teams found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className='flex items-center justify-between px-4 py-3 bg-gray-50 sm:px-6'>
          <div className='flex justify-between flex-1 sm:hidden'>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
          <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm text-muted-foreground'>
                Showing{' '}
                <span className='font-medium'>
                  {table.getRowModel().rows.length}
                </span>{' '}
                of <span className='font-medium'>{tableData.length}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav
                className='relative z-0 inline-flex -space-x-px rounded-md shadow-sm'
                aria-label='Pagination'
              >
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamsPanel;
