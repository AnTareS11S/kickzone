import { useEffect, useState, useMemo } from 'react';
import { Card } from './ui/card';
import DataTable from 'react-data-table-component';
import { Input } from './ui/input';
import Spinner from './Spinner';
import { FaSearch } from 'react-icons/fa';
import ExpandedStatsComponent from './ExpandedStatsComponent';

const CustomDataTable = ({
  columns,
  data,
  isExpandable = false,
  searchable = true,
  pending = false,
  pagination = false,
  defaultSortFieldId,
}) => {
  const [search, setSearch] = useState('');
  const [isPending, setIsPending] = useState(pending);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsPending(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const filteredData = useMemo(() => {
    return data?.filter((item) =>
      Object.values(item)?.some(
        (val) =>
          typeof val === 'string' &&
          val.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  const tableCustomStyles = {
    table: {
      style: {
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        overflow: 'hidden',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#F3F4F6',
        borderBottomWidth: '2px',
        borderBottomColor: '#E5E7EB',
      },
    },
    headCells: {
      style: {
        color: '#111827',
        fontSize: '14px',
        fontWeight: '600',
        padding: '16px',
        textTransform: 'uppercase',
      },
    },
    cells: {
      style: {
        padding: '16px',
        fontSize: '14px',
      },
    },
    rows: {
      style: {
        backgroundColor: '#FFFFFF',
        '&:nth-of-type(odd)': {
          backgroundColor: '#F9FAFB',
        },
        '&:hover': {
          backgroundColor: '#F3F4F6',
          transition: 'all 0.3s',
        },
      },
    },
    pagination: {
      style: {
        borderTop: 'none',
        backgroundColor: '#F9FAFB',
      },
    },
  };

  return (
    <Card className='w-full overflow-hidden rounded-lg shadow-lg'>
      <DataTable
        columns={columns}
        data={searchable ? filteredData : data}
        customStyles={tableCustomStyles}
        highlightOnHover
        pointerOnHover
        subHeader={searchable}
        subHeaderComponent={
          searchable && (
            <div className='flex items-center w-full p-4 bg-white'>
              <FaSearch className='text-gray-400 mr-2' />
              <Input
                type='text'
                placeholder='Search...'
                className='w-full md:w-64 p-2 rounded-md border-none focus:ring-2 focus:ring-blue-500 transition duration-300 bg-gray-100'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )
        }
        progressPending={isPending}
        progressComponent={<Spinner />}
        persistTableHead
        pagination={pagination}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        expandableRows={isExpandable}
        expandableRowsComponent={ExpandedStatsComponent}
        expandOnRowClicked
        defaultSortFieldId={defaultSortFieldId}
        defaultSortAsc={false}
        responsive
        noHeader
        dense
      />
    </Card>
  );
};

export default CustomDataTable;
