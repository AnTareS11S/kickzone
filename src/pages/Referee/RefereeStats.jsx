/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Input } from '../../components/ui/input';
import StatsDialog from '../../components/StatsDialog';

const RefereeStats = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);

  const filteredData = data.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStats = async () => {
    try {
      const res = await fetch('/api/team/team-stats');
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  const columns = [
    {
      name: 'No.',
      selector: (row, index) => index + 1,
      sortable: true,
      grow: 0,
    },
    {
      name: 'Team',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <>
          <StatsDialog row={row} />{' '}
        </>
      ),
    },
  ];

  const tableHeaderStyle = {
    headCells: {
      style: {
        color: '#1F2937',
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: '#F9FAFB',
      },
    },
  };

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      customStyles={tableHeaderStyle}
      highlightOnHover
      persistTableHead
      subHeader
      pagination
      subHeaderComponent={
        <Input
          placeholder='Search...'
          className='w-25'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      }
    />
  );
};

export default RefereeStats;
