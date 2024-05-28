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
        color: '#333333', // Dark gray color for better readability
        fontSize: '16px', // Slightly larger font size
        fontWeight: '600', // Semi-bold font weight
        backgroundColor: '#F8F9FA', // Light gray background color
        padding: '12px', // Equal padding for left and right
        borderBottom: '1px solid #D1D5DB', // Thinner bottom border with a slightly darker color
      },
    },
    rows: {
      style: {
        backgroundColor: '#FFFFFF', // White background color for rows
        borderBottom: '1px solid #E5E7EB', // Light gray bottom border for rows
        borderRadius: '6px', // Slightly smaller border radius
        cursor: 'pointer', // Pointer cursor on hover
        transition: 'box-shadow 0.3s', // Transition for the box-shadow effect
        '&:hover': {
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Box-shadow effect on hover
        },
      },
    },
  };

  return (
    <Card className='w-full overflow-hidden rounded-md shadow-md'>
      <DataTable
        columns={columns}
        data={searchable ? filteredData : data}
        customStyles={tableHeaderStyle}
        highlightOnHover
        subHeader={searchable}
        subHeaderComponent={
          searchable && (
            <div className='flex justify-end w-full p-2'>
              <Input
                type='text'
                placeholder='Search...'
                className='w-full md:w-64 p-2 rounded-md ring-2 ring-gray-300 focus:ring-primary-500 transition duration-300 bg-white'
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
