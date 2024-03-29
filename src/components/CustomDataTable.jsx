import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import DataTable from 'react-data-table-component';
import { Input } from './ui/input';
import Spinner from './Spinner';
import { FaArrowDownLong } from 'react-icons/fa6';
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

  const filteredData = data.filter(
    (item) =>
      (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
      (item.username &&
        item.username.toLowerCase().includes(search.toLowerCase())) ||
      (item.surname &&
        item.surname.toLowerCase().includes(search.toLowerCase()))
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
        backgroundColor: '#e2e8f0',
      },
    },
  };

  return (
    <Card className='flex flex-col mt-5 w-full  rounded-none shadow-md overflow-hidden'>
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
              className='flex w-25 p-2 max-md:mr-auto ring-2 ring-white hover:ring-primary-500 transition duration-300 bg-white'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )
        }
        progressPending={isPending}
        progressComponent={<Spinner />}
        persistTableHead
        pagination={pagination}
        sortIcon={<FaArrowDownLong />}
        expandableRows={isExpandable}
        expandableRowsComponent={ExpandedStatsComponent}
        expandOnRowClicked={true}
        defaultSortFieldId={defaultSortFieldId}
        defaultSortAsc={false}
        responsive={true}
        noHeader={true}
      />
    </Card>
  );
};

export default CustomDataTable;
