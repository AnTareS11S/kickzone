import { Card } from '../../ui/card';
import CustomDataTable from '../../CustomDataTable';
import { Link } from 'react-router-dom';
import { useFetchTeamStatsByLeagueId } from '../../hooks/useFetchTeamStatsByLeagueId';
import { Button } from '../../ui/button';

const TableComponent = ({ leagueId }) => {
  const { teamStats } = useFetchTeamStatsByLeagueId(leagueId);

  const handleDownloadXLSX = async () => {
    const res = await fetch(`/api/team/download-xlsx/${leagueId}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'LeagueStandings.xlsx');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      grow: 0.5,
    },
    {
      name: 'Team',
      selector: (row) => {
        return (
          <div className='flex items-center'>
            <img
              src={row.logo}
              alt={row.name}
              className='w-8 h-8 object-contain rounded-full mr-2'
            />
            <Link to={`/league/team/${row.team}`}>{row.name}</Link>
          </div>
        );
      },
      grow: 2,
    },
    {
      name: 'Played',
      selector: (row) => row.gamesPlayed,
      sortable: true,
      hide: 'sm',
    },
    {
      name: 'Won',
      selector: (row) => row.wins,
      sortable: true,
      hide: 'md',
    },
    {
      name: 'Drawn',
      selector: (row) => row.draws,
      sortable: true,
      hide: 'md',
    },
    {
      name: 'Lost',
      selector: (row) => row.losses,
      sortable: true,
      hide: 'md',
    },
    {
      name: 'GF',
      selector: (row) => row.goalsFor,
      sortable: true,
      hide: 'md',
    },
    {
      name: 'GA',
      selector: (row) => row.goalsAgainst,
      sortable: true,
      hide: 'md',
    },
    {
      name: 'GD',
      selector: (row) => row.goalDifference,
      sortable: true,
      hide: 'lg',
    },
    {
      name: 'Points',
      selector: (row) => row.points,
      sortable: true,
    },
  ];

  return (
    <>
      <div className='flex max-sm:my-10 justify-end'>
        <Button
          className='bg-primary-500 hover:bg-purple-500'
          onClick={handleDownloadXLSX}
        >
          Download Standings.xlsx
        </Button>
      </div>
      <Card className='flex flex-col mt-5 w-full rounded-none shadow-md'>
        <CustomDataTable columns={columns} data={teamStats} pending />
      </Card>
    </>
  );
};

export default TableComponent;
