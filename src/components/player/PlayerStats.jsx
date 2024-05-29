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
          let data = await res.json();
          data = data.filter((player) => {
            switch (type) {
              case 'goals':
                return player.goals > 0;
              case 'assists':
                return player.assists > 0;
              case 'yellowCards':
                return player.yellowCards > 0;
              case 'redCards':
                return player.redCards > 0;
              case 'cleanSheets':
                return player.cleanSheets > 0;
              default:
                return false;
            }
          });
          setPlayersStats(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayersStats();
  }, [leagueId, type]);

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
            <Link
              to={`/player/${row.playerId}`}
              className=' hover:text-purple-500'
            >
              {row.name}
            </Link>
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
              src={row.logoUrl}
              alt={row.name}
              className='w-8 h-8 object-contain rounded-full mr-2'
            />
            <Link
              to={`/league/team/${row.teamId}`}
              className=' hover:text-purple-500'
            >
              {row.team}
            </Link>
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
    return <Spinner />;
  }

  return (
    <Card className='grid mt-5 w-full rounded-none shadow-md'>
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
