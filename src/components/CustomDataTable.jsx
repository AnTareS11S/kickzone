/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import DataTable from 'react-data-table-component';
import { Input } from './ui/input';
import Spinner from './Spinner';

const CustomDataTable = ({
  columns,
  data,
  searchable = true,
  pending = false,
  pagination = false,
}) => {
  const [search, setSearch] = useState('');
  const [isPending, setIsPending] = useState(pending);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsPending(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const filteredData = data.filter(
    (item) =>
      (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
      (item.username &&
        item.username.toLowerCase().includes(search.toLowerCase()))
  );

  const tableHeaderStyle = {
    headCells: {
      style: {
        color: '#1F2937',
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: '#e2e8f0',
      },
    },
    rows: {
      highlightOnHoverStyle: {
        backgroundColor: 'rgb(230, 244, 244)',
        borderBottomColor: '#FFFFFF',
        borderRadius: '25px',
        outline: '1px solid #FFFFFF',
      },
    },
    headRow: {
      style: {
        border: 'none',
      },
    },
  };

  return (
    <Card className='flex flex-col mt-5 w-full rounded-none shadow-md'>
      <DataTable
        columns={columns}
        data={filteredData}
        customStyles={tableHeaderStyle}
        highlightOnHover
        subHeader={searchable}
        subHeaderComponent={
          searchable && (
            <Input
              type='text'
              placeholder='Search...'
              className='w-25'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )
        }
        progressPending={isPending}
        progressComponent={<Spinner />}
        persistTableHead
        pagination={pagination}
      />
    </Card>
  );
};

export default CustomDataTable;
