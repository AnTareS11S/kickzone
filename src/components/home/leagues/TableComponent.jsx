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
      className: 'text-sm font-semibold',
    },
    {
      name: 'Team',
      selector: (row) => {
        return (
          <div className='flex items-center'>
            <img
              src={
                row.logoUrl ||
                'https://d3awt09vrts30h.cloudfront.net/team_img_default.png'
              }
              alt={row.name}
              className='h-8 w-8 rounded-full object-contain mr-2'
            />
            <Link
              to={`/league/team/${row.team}`}
              className=' hover:text-purple-500'
            >
              {row.name}
            </Link>
          </div>
        );
      },
      grow: 2,
      className: 'text-sm',
    },
    {
      name: 'Played',
      selector: (row) => row.gamesPlayed,
      sortable: true,
      hide: 'sm',
      className: 'text-sm',
    },
    {
      name: 'Won',
      selector: (row) => row.wins,
      sortable: true,
      hide: 'md',
      className: 'text-sm',
    },
    {
      name: 'Drawn',
      selector: (row) => row.draws,
      sortable: true,
      hide: 'md',
      className: 'text-sm',
    },
    {
      name: 'Lost',
      selector: (row) => row.losses,
      sortable: true,
      hide: 'md',
      className: 'text-sm',
    },
    {
      name: 'GF',
      selector: (row) => row.goalsFor,
      sortable: true,
      hide: 'md',
      className: 'text-sm',
    },
    {
      name: 'GA',
      selector: (row) => row.goalsAgainst,
      sortable: true,
      hide: 'md',
      className: 'text-sm',
    },
    {
      name: 'GD',
      selector: (row) => row.goalDifference,
      sortable: true,
      hide: 'lg',
      className: 'text-sm',
    },
    {
      name: 'Points',
      selector: (row) => row.points,
      sortable: true,
      className: 'text-sm font-semibold',
    },
  ];

  return (
    <div className='p-4 md:p-8'>
      <div className='flex max-sm:my-10 justify-end mb-4'>
        <Button
          className='bg-primary-500 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300'
          onClick={handleDownloadXLSX}
        >
          Download Standings.xlsx
        </Button>
      </div>
      <Card className='rounded-lg shadow-md grid overflow-hidden'>
        <CustomDataTable columns={columns} data={teamStats} pending />
      </Card>
    </div>
  );
};

export default TableComponent;
