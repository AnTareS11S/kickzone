import PlayerStats from '../../components/referee/PlayerStats';
import Results from '../../components/referee/Results';
import Schedule from '../../components/referee/Schedule';
import { Separator } from '../../components/ui/separator';

const RefereeDashboard = () => {
  return (
    <>
      <div className='text-heading2-bold mb-4'>Referee Dashboard</div>
      <Separator />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 '>
        <Schedule />
        <Results />
        <PlayerStats />
      </div>
    </>
  );
};

export default RefereeDashboard;
