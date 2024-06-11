import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { TbRectangleVerticalFilled } from 'react-icons/tb';
import Spinner from '../../Spinner';

const TeamStats = () => {
  const teamId = useParams().id;
  const [redCards, setRedCards] = useState([]);
  const [yellowCards, setYellowCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRedCards = async () => {
      try {
        const res = await fetch(`/api/team/team-cards/${teamId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
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
    getRedCards();
  }, [teamId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='max-w-4xl mx-auto py-12'>
      <h2 className='text-3xl font-bold text-gray-800 mb-8'>Team Statistics</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-xl font-semibold text-gray-800 flex items-center'>
              <TbRectangleVerticalFilled className='h-5 w-5 text-red-500 mr-2' />
              Red Cards
            </h3>
            <FaRegCalendarAlt className='text-gray-500' />
          </div>
          {redCards?.map((card, index) => (
            <div key={index} className='mb-4'>
              <h4 className='text-lg font-semibold text-gray-700 mb-2'>
                {card?.season}
              </h4>
              <p className='text-gray-600'>{card?.count} Red Cards</p>
            </div>
          ))}
        </div>
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-xl font-semibold text-gray-800 flex items-center'>
              <TbRectangleVerticalFilled className='h-5 w-5 text-yellow-500 mr-2' />
              Yellow Cards
            </h3>
            <FaRegCalendarAlt className='text-gray-500' />
          </div>
          {yellowCards?.map((card, index) => (
            <div key={index} className='mb-4'>
              <h4 className='text-lg font-semibold text-gray-700 mb-2'>
                {card?.season}
              </h4>
              <p className='text-gray-600'>{card?.count} Yellow Cards</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamStats;
