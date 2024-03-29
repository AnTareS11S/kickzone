import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const TeamMatches = () => {
  const [matches, setMatches] = useState([]);
  const pathname = useLocation().pathname.split('/')[3];

  useEffect(() => {
    const getMatches = async () => {
      try {
        const res = await fetch(`/api/team/matches/${pathname}`);
        const data = await res.json();
        setMatches(data);
      } catch (error) {
        console.log(error);
      }
    };

    getMatches();
  }, [pathname]);

  return (
    <div className='container mx-auto mt-8 items-center rounded-lg'>
      {matches.map((match) => (
        <div key={match._id} className='bg-gray-200 p-4 my-4 '>
          <h2 className='text-heading4-medium'>{` ${match.round.name}`}</h2>
          <p className='text-lg'>{`Date: ${new Date(
            match.startDate
          ).toLocaleString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}`}</p>
          <p className='text-lg'>{`Opponent: ${match.awayTeam.name}`}</p>
        </div>
      ))}
    </div>
  );
};

export default TeamMatches;
