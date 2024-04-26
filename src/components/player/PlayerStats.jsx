import { Card } from '../ui/card';
import CustomDataTable from '../CustomDataTable';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner';

const PlayerStats = ({ leagueId, type }) => {
  const [playersStats, setPlayersStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayersStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/player/top-stats/${leagueId}`);
        if (res.ok) {
          const data = await res.json();
          setPlayersStats(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayersStats();
  }, [leagueId]);

  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      grow: 0.5,
    },
    {
      name: 'Player',
      selector: (row) => {
        return (
          <div className='flex items-center'>
            <Link to={`/player/${row.playerId}`}>{row.name}</Link>
          </div>
        );
      },
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
            <Link to={`/league/team/${row.teamId}`}>{row.team}</Link>
          </div>
        );
      },
      grow: 1,
      hide: 'sm',
    },
    {
      name: type.charAt(0).toUpperCase() + type.slice(1),
      selector: (row) => {
        switch (type) {
          case 'goals':
            return row.goals;
          case 'assists':
            return row.assists;
          case 'yellowCards':
            return row.yellowCards;
          case 'redCards':
            return row.redCards;
          case 'cleanSheets':
            return row.cleanSheets;
          default:
            return row.goals;
        }
      },
      grow: 0.5,
    },
  ];

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner />
      </div>
    );
  }

  return (
    <Card className='flex flex-col mt-5 w-full rounded-none shadow-md'>
      <CustomDataTable
        columns={columns}
        data={playersStats}
        defaultSortFieldId={4}
        pending
      />
    </Card>
  );
};

export default PlayerStats;
