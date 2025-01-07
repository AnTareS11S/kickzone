import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  FaFutbol,
  FaHandsHelping,
  FaShieldAlt,
  FaClock,
  FaExclamationTriangle,
} from 'react-icons/fa';
import PageHeader from '../../components/PageHeader';
import Spinner from '../../components/Spinner';
import { GetPlayerByUserId } from '../../api/getPlayerByUserId';
import { GetPlayerStatsById } from '../../api/getPlayerStatsById';

const StatCard = ({ icon: Icon, label, value }) => (
  <Card className='overflow-hidden'>
    <CardContent className='p-6'>
      <div className='flex items-center gap-4'>
        <div className='rounded-full bg-blue-50 p-3'>
          <Icon className='h-6 w-6 text-blue-600' />
        </div>
        <div className='flex-1'>
          <p className='text-sm font-medium text-gray-500'>{label}</p>
          <div className='flex items-baseline gap-2'>
            <span className='text-2xl font-bold text-gray-900'>{value}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const PlayerStatistics = () => {
  const { player, loading } = GetPlayerByUserId();
  const { playerStats } = GetPlayerStatsById(player?._id);

  const currentStats = playerStats?.[0] || null;

  if (loading) {
    return <Spinner />;
  }

  if (!currentStats || !player) {
    return (
      <div className='p-6'>
        <Card>
          <CardContent className='p-8'>
            <div className='flex flex-col items-center justify-center text-center space-y-4'>
              <FaExclamationTriangle className='w-12 h-12 text-yellow-500' />
              <h3 className='text-xl font-bold'>No Stats Available Yet</h3>
              <p className='text-slate-400'>
                Your statistics will appear here after your first match.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='max-w-8xl mx-auto space-y-6'>
        <PageHeader
          title='My Performance'
          description='Track your progress and achievements'
        />

        <div className='grid gap-6'>
          <div
            className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${
              currentStats.cleanSheets === 0
                ? 'lg:grid-cols-3'
                : 'lg:grid-cols-4'
            }`}
          >
            <StatCard
              icon={FaFutbol}
              label='Goals'
              value={currentStats.goals}
            />
            <StatCard
              icon={FaHandsHelping}
              label='Assists'
              value={currentStats.assists}
            />
            {currentStats.cleanSheets === 0 ? null : (
              <StatCard
                icon={FaShieldAlt}
                label='Clean Sheets'
                value={currentStats.cleanSheets}
              />
            )}
            <StatCard
              icon={FaClock}
              label='Minutes Played'
              value={currentStats.minutesPlayed}
            />
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-gray-900'>
                  Goal Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-600'>Goals + Assists</span>
                    <span className='text-2xl font-bold text-gray-900'>
                      {currentStats.goals + currentStats.assists}
                    </span>
                  </div>
                  <div className='h-2 overflow-hidden rounded-full bg-gray-100'>
                    <div
                      className='h-full bg-blue-500'
                      style={{
                        width: `${
                          (currentStats.goals /
                            (currentStats.goals + currentStats.assists)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>Goals ({currentStats.goals})</span>
                    <span>Assists ({currentStats.assists})</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-gray-900'>
                  Discipline Record
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between rounded-lg bg-amber-50 p-4'>
                    <span className='font-medium text-amber-700'>
                      Yellow Cards
                    </span>
                    <span className='text-2xl font-bold text-amber-700'>
                      {currentStats.yellowCards}
                    </span>
                  </div>
                  <div className='flex items-center justify-between rounded-lg bg-rose-50 p-4'>
                    <span className='font-medium text-rose-700'>Red Cards</span>
                    <span className='text-2xl font-bold text-rose-700'>
                      {currentStats.redCards}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatistics;
