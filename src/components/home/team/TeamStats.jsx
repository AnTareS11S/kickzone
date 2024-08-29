import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  FaCheckCircle,
  FaRegCalendarAlt,
  FaSquare,
  FaTimesCircle,
  FaHandshake,
} from 'react-icons/fa';
import { PiSoccerBallFill } from 'react-icons/pi';
import Spinner from '../../Spinner';
import { useFetchSeasons } from '../../hooks/useFetchSeasons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

const fetchData = async (url, setter, setLoading) => {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    setter(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const TeamStats = () => {
  const { id: teamId } = useParams();
  const [stats, setStats] = useState({
    redCards: [],
    yellowCards: [],
    goalsScored: [],
    goalsLost: [],
    wins: null,
    draws: null,
    losses: null,
  });
  const seasons = useFetchSeasons();
  const [selectedSeason, setSelectedSeason] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch initial season
  useEffect(() => {
    if (seasons.length > 0) {
      const lastSeason = seasons[seasons.length - 1].split(':')[1];
      setSelectedSeason(lastSeason);
    }
  }, [seasons]);

  // Fetch team stats when season or teamId changes
  useEffect(() => {
    if (selectedSeason) {
      setLoading(true);

      fetchData(
        `/api/team/team-cards/${teamId}?season=${selectedSeason}`,
        (data) => {
          setStats((prev) => ({
            ...prev,
            redCards: data.redCards,
            yellowCards: data.yellowCards,
          }));
        },
        setLoading
      );

      fetchData(
        `/api/team/team-goals/${teamId}?season=${selectedSeason}`,
        (data) => {
          setStats((prev) => ({
            ...prev,
            goalsScored: data.goalsScored,
            goalsLost: data.goalsLost,
          }));
        },
        setLoading
      );

      fetchData(
        `/api/team/team-outcomes/${teamId}?season=${selectedSeason}`,
        (data) => {
          setStats((prev) => ({
            ...prev,
            wins: data.wins,
            draws: data.draws,
            losses: data.losses,
          }));
        },
        setLoading
      );
    }
  }, [teamId, selectedSeason]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='max-w-6xl mx-auto py-12'>
      <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center'>
        Team Statistics
      </h2>
      <div className='bg-white rounded-lg shadow-lg p-8'>
        <div className='flex items-center justify-between mb-8'>
          <h3 className='text-2xl font-semibold text-gray-800'>
            Statistics Overview
          </h3>
          <div className='flex items-center space-x-2'>
            <Select
              value={selectedSeason}
              onValueChange={(value) => {
                setSelectedSeason(value);
                setLoading(true);
              }}
            >
              <SelectTrigger className='flex items-center border border-gray-300 rounded-lg px-4 py-2 hover:border-gray-500'>
                <SelectValue placeholder='Select Season' />
              </SelectTrigger>
              <SelectContent>
                {seasons?.map((season, index) => (
                  <SelectItem key={index} value={season?.split(':')[1]}>
                    {season?.split(':')[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FaRegCalendarAlt className='text-gray-500' />
          </div>
        </div>
        <div className='mb-8'>
          <h4 className='text-xl font-semibold text-gray-700'>
            {stats.yellowCards[0]?.league} - {stats.yellowCards[0]?.season}
          </h4>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 my-8'>
          <StatCard
            title='Wins'
            value={stats.wins || 0}
            icon={<FaCheckCircle className='text-green-500' />}
            color='green-500'
          />
          <StatCard
            title='Draws'
            value={stats.draws || 0}
            icon={<FaHandshake className='text-blue-500' />}
            color='blue-500'
          />
          <StatCard
            title='Losses'
            value={stats.losses || 0}
            icon={<FaTimesCircle className='text-gray-500' />}
            color='gray-500'
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8'>
          <DetailCard
            title='Goals Scored'
            items={stats.goalsScored}
            icon={<PiSoccerBallFill className='w-5 h-5 text-black' />}
          />
          <DetailCard
            title='Goals Lost'
            items={stats.goalsLost}
            icon={<PiSoccerBallFill className='w-5 h-5 text-red-500' />}
          />
          <DetailCard
            title='Yellow Cards'
            items={stats.yellowCards}
            icon={<FaSquare className='w-5 h-5 text-yellow-500' />}
          />
          <DetailCard
            title='Red Cards'
            items={stats.redCards}
            icon={<FaSquare className='w-5 h-5 text-red-500' />}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-gray-100 p-6 rounded-lg shadow-md text-${color}`}>
    <div className='flex items-center mb-4'>
      {icon}
      <h4 className='text-xl font-semibold text-gray-800 ml-2'>{title}</h4>
    </div>
    <p className={`text-4xl font-bold text-${color}`}>{value}</p>
  </div>
);

const DetailCard = ({ title, items, icon }) => (
  <div>
    <div className='flex items-center mb-4'>
      <h4 className='text-xl font-semibold text-gray-800 ml-2'>{title}</h4>
    </div>
    {items?.map((item, index) => (
      <div key={index} className='mb-4 ml-8'>
        <p className='text-body-medium flex items-center gap-2 text-gray-700'>
          {icon} {item?.count}
        </p>
      </div>
    ))}
  </div>
);

export default TeamStats;
