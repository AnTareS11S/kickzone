/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import TeamDetails from '../../components/home/team/TeamDetails';
import { Separator } from '../../components/ui/separator';
import BackButton from '../../components/BackButton';

const TeamPage = () => {
  const [team, setTeam] = useState({});
  const [loading, setLoading] = useState(false);
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
      <BackButton />
      <Separator />
      <TeamDetails data={team} isLoading={loading} />
    </>
  );
};

export default TeamPage;
