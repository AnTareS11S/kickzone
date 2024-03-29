import { Card } from '../../ui/card';
import CustomDataTable from '../../CustomDataTable';
import { Link } from 'react-router-dom';
import { useFetchTeamStatsByLeagueId } from '../../hooks/useFetchTeamStatsByLeagueId';

const TableComponent = ({ leagueId }) => {
  const { teamStats } = useFetchTeamStatsByLeagueId(leagueId);
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
    <Card className='flex flex-col mt-5 w-full rounded-none shadow-md'>
      <CustomDataTable columns={columns} data={teamStats} pending />
    </Card>
  );
};

export default TableComponent;
