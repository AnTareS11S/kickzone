import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { TbRectangleVerticalFilled } from 'react-icons/tb';
import { PiSoccerBallFill } from 'react-icons/pi';
import Spinner from '../../Spinner';

const TeamStats = () => {
  const teamId = useParams().id;
  const [redCards, setRedCards] = useState([]);
  const [yellowCards, setYellowCards] = useState([]);
  const [goalsScored, setGoalsScored] = useState([]);
  const [goalsLost, setGoalsLost] = useState([]);
  const [season, setSeason] = useState('');
  const [league, setLeague] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTeamCards = async () => {
      try {
        const res = await fetch(`/api/team/team-cards/${teamId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        if (data.yellowCards.length > 0) {
          setSeason(data.yellowCards[0].season);
          setLeague(data.yellowCards[0].league);
        } else if (data.redCards.length > 0) {
          setSeason(data.redCards[0].season);
          setLeague(data.redCards[0].league);
        }

        setRedCards(data.redCards);
        setYellowCards(data.yellowCards);
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getTeamCards();
  }, [teamId]);

  useEffect(() => {
    const getTeamGoals = async () => {
      try {
        const res = await fetch(`/api/team/team-goals/${teamId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        setGoalsScored(data.goalsScored);
        setGoalsLost(data.goalsLost);
      } catch (error) {
        console.log(error);
      }
    };
    getTeamGoals();
  }, [teamId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='max-w-4xl mx-auto py-12'>
      <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center'>
        Team Statistics
      </h2>
      <div className='bg-white rounded-lg shadow-lg p-8'>
        <div className='flex items-center justify-between mb-8'>
          <h3 className='text-2xl font-semibold text-gray-800'>
            Statistics Overview
          </h3>
          <FaRegCalendarAlt className='text-gray-500' />
        </div>
        <div className='mb-8'>
          <h4 className='text-xl font-semibold text-gray-700'>
            {league} - {season}
          </h4>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8'>
          <div>
            <div className='flex items-center mb-4'>
              <PiSoccerBallFill className='h-5 w-5 text-black mr-2' />
              <h4 className='text-xl font-semibold text-gray-800'>
                Goals Scored
              </h4>
            </div>
            {goalsScored?.map((goal, index) => (
              <div key={index} className='mb-4'>
                <p className='text-lg text-gray-700'>{goal?.count} Goals</p>
              </div>
            ))}
          </div>
          <div>
            <div className='flex items-center mb-4'>
              <PiSoccerBallFill className='h-5 w-5 text-red-500 mr-2' />
              <h4 className='text-xl font-semibold text-gray-800'>
                Goals Lost
              </h4>
            </div>
            {goalsLost?.map((goal, index) => (
              <div key={index} className='mb-4'>
                <p className='text-lg text-gray-700'>{goal?.count} Goals</p>
              </div>
            ))}
          </div>
          <div>
            <div className='flex items-center mb-4'>
              <TbRectangleVerticalFilled className='h-5 w-5 text-yellow-500 mr-2' />
              <h4 className='text-xl font-semibold text-gray-800'>
                Yellow Cards
              </h4>
            </div>
            {yellowCards?.map((card, index) => (
              <div key={index} className='mb-4'>
                <p className='text-lg text-gray-700'>
                  {card?.count} Yellow Cards
                </p>
              </div>
            ))}
          </div>
          <div>
            <div className='flex items-center mb-4'>
              <TbRectangleVerticalFilled className='h-5 w-5 text-red-500 mr-2' />
              <h4 className='text-xl font-semibold text-gray-800'>Red Cards</h4>
            </div>
            {redCards?.map((card, index) => (
              <div key={index} className='mb-4'>
                <p className='text-lg text-gray-700'>{card?.count} Red Cards</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamStats;
