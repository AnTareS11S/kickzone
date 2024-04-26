import TeamDetails from '../../components/home/team/TeamDetails';
import { Separator } from '../../components/ui/separator';
import BackButton from '../../components/BackButton';
import { useLocation } from 'react-router-dom';
import { useFetchTeamById } from '../../components/hooks/useFetchTeamById';

const TeamPage = () => {
  const teamId = useLocation().pathname.split('/').pop();
  const { team, loading } = useFetchTeamById(teamId);

  return (
    <>
      <BackButton />
      <Separator />
      <TeamDetails data={team} isLoading={loading} />
    </>
  );
};

export default TeamPage;
