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
import { useLocation } from 'react-router-dom';
import { useFetchFilledResultMatches } from '../../components/hooks/useFetchFilledResultMatches';
import Spinner from '../../components/Spinner';

const ResultsManagement = () => {
  const pathname = useLocation().pathname.split('/')[5];
  const { matches: notFilledMatches, loading } =
    useFetchCompletedMatches(pathname);
  const filledMatches = useFetchFilledResultMatches(pathname);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='container mx-auto space-y-6'>
      <BackButton />
      <div>
        <div className='text-heading2-bold'>Results</div>
        <p className='text-sm text-muted-foreground'>
          Manage match results here.
        </p>
      </div>

      <Separator />

      <Tabs defaultValue='notFilled' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='notFilled'>Not Filled</TabsTrigger>
          <TabsTrigger value='filled'>Filled</TabsTrigger>
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
