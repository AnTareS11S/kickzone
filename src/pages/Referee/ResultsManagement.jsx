import { useFetchCompletedMatches } from '../../components/hooks/useFetchCompletedMatches';
import { Separator } from '../../components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import NotFilledMatches from './NotFilledMatches';
import FilledMatches from './FilledMatches';
import BackButton from '../../components/BackButton';
import { useParams } from 'react-router-dom';
import { useFetchFilledResultMatches } from '../../components/hooks/useFetchFilledResultMatches';
import Spinner from '../../components/Spinner';

const ResultsManagement = () => {
  const leagueId = useParams().id;
  const { matches: notFilledMatches, loading } =
    useFetchCompletedMatches(leagueId);
  const { matches: filledMatches } = useFetchFilledResultMatches(leagueId);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='container mx-auto px-4 py-8 md:px-6 lg:px-8'>
      <BackButton />
      <div className='mb-6'>
        <h1 className='text-3xl font-bold mb-2'>Match Results</h1>
        <p className='text-gray-600'>Manage match results here.</p>
      </div>

      <Separator />

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
