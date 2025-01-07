import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import NotFilledMatches from './NotFilledMatches';
import FilledMatches from './FilledMatches';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import PageHeader from '../../components/PageHeader';
import { GetCompletedMatches } from '../../api/getCompletedMatches';
import { GetFilledResultMatches } from '../../api/getFilledResultMatches';
import { GetSeasonByLeagueId } from '../../api/getSeasonByLeagueId';

const ResultsManagement = () => {
  const leagueId = useParams().id;
  const { matches: notFilledMatches, loading } = GetCompletedMatches(leagueId);
  const { matches: filledMatches } = GetFilledResultMatches(leagueId);
  const { season, league } = GetSeasonByLeagueId(leagueId);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='container mx-auto px-4 py-8 md:px-6 lg:px-8'>
      <PageHeader
        title='Match Results'
        description='Manage match results here'
        sideText={`${league} / ${season?.name}`}
      />

      <Tabs
        defaultValue='notFilled'
        className='bg-white rounded-lg shadow-md p-6'
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger
            value='notFilled'
            className='py-2 px-4 bg-gray-200 rounded-md text-gray-600 font-medium hover:bg-gray-300 transition-colors'
          >
            Not Filled
          </TabsTrigger>
          <TabsTrigger
            value='filled'
            className='py-2 px-4 bg-gray-200 rounded-md text-gray-600 font-medium hover:bg-gray-300 transition-colors'
          >
            Filled
          </TabsTrigger>
        </TabsList>
        <TabsContent value='notFilled'>
          <NotFilledMatches matches={notFilledMatches} />
        </TabsContent>
        <TabsContent value='filled'>
          <FilledMatches matches={filledMatches} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsManagement;
