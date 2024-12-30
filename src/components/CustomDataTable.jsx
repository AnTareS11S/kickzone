import { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import Spinner from './Spinner';
import { FaChevronRight, FaSearch } from 'react-icons/fa';
import { Input } from './ui/input';
import { Card } from './ui/card';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsPending(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  const renderCellValue = (row, column) => {
    if (typeof column.selector === 'function') {
      return column.selector(row);
    }
    if (typeof column.selector === 'string') {
      return row[column.selector];
    }
    if (column.cell) {
      return column.cell(row);
    }
    return '';
  };

  const mobileColumns = columns.filter(
    (col) =>
      col.name !== 'No.' &&
      col.selector !== 'index' &&
      !col.name?.toLowerCase().includes('no.')
  );

  const MobileCard = ({ data }) => (
    <Card className='mb-4 overflow-hidden border border-slate-200'>
      <div className='p-4 space-y-3'>
        {mobileColumns.map((column, index) => (
          <div key={index} className='flex justify-between items-start'>
            <span className='text-sm font-medium text-slate-500'>
              {column.name}
            </span>
            <span className='text-sm text-right text-slate-900'>
              {renderCellValue(data, column)}
            </span>
          </div>
        ))}
      </div>
      {isExpandable && (
        <div className='border-t border-slate-200 p-3 bg-slate-50'>
          <button className='w-full flex items-center justify-center text-sm text-slate-600'>
            View Details
            <FaChevronRight className='ml-1 h-4 w-4' />
          </button>
        </div>
      )}
    </Card>
  );
  const MobileView = () => (
    <div className='space-y-4'>
      {(searchable ? filteredData : data)?.map((item, index) => (
        <MobileCard key={index} data={item} />
      ))}
    </div>
  );

  const tableCustomStyles = {
    table: {
      style: {
        backgroundColor: 'white',
        borderRadius: '0.75rem',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#f8fafc',
        borderBottom: '2px solid #e2e8f0',
        minHeight: '3.5rem',
      },
    },
    headCells: {
      style: {
        color: '#1e293b',
        fontSize: '0.875rem',
        fontWeight: '600',
        padding: '1rem',
      },
    },
    cells: {
      style: {
        padding: '1rem',
        fontSize: '0.875rem',
        color: '#334155',
      },
    },
    rows: {
      style: {
        backgroundColor: 'white',
        '&:nth-of-type(odd)': {
          backgroundColor: '#f8fafc',
        },
        '&:hover': {
          backgroundColor: '#f1f5f9',
        },
        minHeight: '3.5rem',
      },
    },
  };

  return (
    <Card className='w-full overflow-hidden rounded-xl shadow-lg border border-slate-200'>
      <div className='flex flex-col'>
        {searchable && (
          <div className='p-4 border-b border-slate-200 bg-white'>
            <div className='relative max-w-md w-full'>
              <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                <FaSearch className='h-4 w-4 text-slate-400' />
              </div>
              <Input
                type='text'
                placeholder='Search...'
                className='pl-10 pr-4 py-2 w-full bg-slate-50 border-slate-200 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         placeholder:text-slate-400 text-sm'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className='relative'>
          {isMobile ? (
            <div className='p-4'>
              <MobileView />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={searchable ? filteredData : data}
              customStyles={tableCustomStyles}
              highlightOnHover
              pointerOnHover
              progressPending={isPending}
              progressComponent={
                <div className='w-full h-64 flex items-center justify-center'>
                  <Spinner />
                </div>
              }
              pagination={pagination}
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 25, 50]}
              expandableRows={isExpandable}
              expandOnRowClicked
              defaultSortFieldId={defaultSortFieldId}
              defaultSortAsc={false}
              noDataComponent={
                <div className='p-8 text-center text-slate-500'>
                  No records to display
                </div>
              }
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default CustomDataTable;
