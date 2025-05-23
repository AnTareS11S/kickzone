import TableComponent from '../../components/home/leagues/TableComponent';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';

import TeamCard from '../../components/home/leagues/TeamCard';
import { Separator } from '../../components/ui/separator';
import Spinner from '../../components/Spinner';
import BackButton from '../../components/BackButton';
import { useParams } from 'react-router-dom';
import PlayerStats from '../../components/player/PlayerStats';
import { GetTeamsByLeagueId } from '../../api/getTeamsByLeagueId';

const LeaguePage = () => {
  const leagueId = useParams().id;
  const { teams, loading, leagueName } = GetTeamsByLeagueId(leagueId);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <BackButton />
      <div className='flex items-center justify-center text-2xl font-bold text-center'>
        <p className='text-heading1-bold'>{leagueName}</p>
      </div>
      <Separator />
      <Tabs defaultValue='teams' className='w-full pt-5'>
        <TabsList className='flex flex-wrap text-body-medium gap-3 max-sm:pb-28 max-md:pb-20 max-lg:pb-20 max-xl:pb-20'>
          <TabsTrigger value='teams'>Teams</TabsTrigger>
          <TabsTrigger value='standings'>Standings</TabsTrigger>
          <TabsTrigger value='top_scorers'>Top Scorers</TabsTrigger>
          <TabsTrigger value='top_assistents'>Top Assistents</TabsTrigger>
          <TabsTrigger value='y_cards'>Yellow Cards</TabsTrigger>
          <TabsTrigger value='r_cards'>Red Cards</TabsTrigger>
          <TabsTrigger value='clean_sheets'>Clean Sheets</TabsTrigger>
        </TabsList>
        <TabsContent value='teams'>
          <TeamCard data={teams} />
        </TabsContent>
        <TabsContent value='standings'>
          <TableComponent leagueId={leagueId} />
        </TabsContent>
        <TabsContent value='top_scorers'>
          <PlayerStats leagueId={leagueId} type='goals' />
        </TabsContent>
        <TabsContent value='top_assistents'>
          <PlayerStats leagueId={leagueId} type='assists' />
        </TabsContent>
        <TabsContent value='y_cards'>
          <PlayerStats leagueId={leagueId} type='yellowCards' />
        </TabsContent>
        <TabsContent value='r_cards'>
          <PlayerStats leagueId={leagueId} type='redCards' />
        </TabsContent>
        <TabsContent value='clean_sheets'>
          <PlayerStats leagueId={leagueId} type='cleanSheets' />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default LeaguePage;
