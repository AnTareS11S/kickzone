/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamDetails from '../../components/home/team/TeamDetails';
import { Separator } from '../../components/ui/separator';

const TeamPage = () => {
  const [team, setTeam] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const pathname = window.location.pathname.split('/').pop();

  const getTeam = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/team/${pathname}`);
      const data = await res.json();
      setTeam(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeam();
  }, []);

  return (
    <>
      <div
        className='cursor-pointer mb-2 inline-flex items-center justify-center bg-primary-500 hover:bg-purple-500 text-white font-bold py-1 px-3 rounded'
        onClick={() => navigate(-1)}
      >
        <span className='mr-1'>&#8592;</span> Back
      </div>
      <Separator />
      <TeamDetails data={team} isLoading={loading} />
    </>
  );
};

export default TeamPage;
