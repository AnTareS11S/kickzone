import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  FaAward,
  FaCalendar,
  FaClock,
  FaPlayCircle,
  FaStar,
} from 'react-icons/fa';
import { useSocket } from '../../hook/useSocket';

const ActiveTrainings = ({
  trainings,
  isArchived = false,
  currentUser,
  currentTeamId,
  playerId,
}) => {
  const { emit } = useSocket();

  const handleMarkAsRead = (trainingId) => {
    if (currentUser?.role === 'player') {
      emit('markTeamTrainingNotificationRead', {
        teamId: currentTeamId,
        userId: playerId,
        trainingId,
      });
    }
  };

  const renderTrainingStatus = () => {
    const statusVariants = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
    };

    const status = isArchived ? 'completed' : 'active';
    return (
      <Badge
        className={`${statusVariants[status]} text-xs font-medium px-2 py-1 rounded-full hover:bg-blue-300`}
      >
        {isArchived ? 'Completed' : 'Upcoming'}
      </Badge>
    );
  };

  const renderEmptyState = () => (
    <div className='flex flex-col items-center justify-center py-12 space-y-4 text-center'>
      {isArchived ? (
        <FaAward
          className='text-primary-500 w-16 h-16 opacity-50'
          strokeWidth={1.5}
        />
      ) : (
        <FaPlayCircle
          className='text-primary-500 w-16 h-16 opacity-80'
          strokeWidth={1.5}
        />
      )}
      <p className='text-lg text-gray-500'>
        No {isArchived ? 'completed' : 'active'} trainings at the moment
      </p>
      <p className='text-sm text-gray-400'>
        {isArchived
          ? 'Your completed trainings will appear here'
          : 'Upcoming trainings will be displayed when scheduled'}
      </p>
    </div>
  );

  return (
    <Card className='w-full shadow-lg hover:shadow-xl transition-all duration-300'>
      <CardHeader className='flex flex-row items-center justify-between border-b pb-4'>
        <CardTitle className='text-2xl font-bold text-gray-800 flex items-center space-x-3'>
          {isArchived ? (
            <>
              <FaAward className='text-primary-500' size={28} />
              <span>Completed Trainings</span>
            </>
          ) : (
            <>
              <FaPlayCircle className='text-primary-500' size={28} />
              <span>Upcoming Trainings</span>
            </>
          )}
        </CardTitle>
        {trainings && trainings.length > 0 && (
          <span className='text-sm text-gray-500'>
            {trainings.length} {isArchived ? 'Completed' : 'Upcoming'} Trainings
          </span>
        )}
      </CardHeader>

      <CardContent className='p-0'>
        {trainings && trainings.length > 0 ? (
          <div className='divide-y'>
            {trainings.map((training) => (
              <Link
                to={`/training/${training._id}`}
                key={training._id}
                className='block hover:bg-gray-50 transition-colors duration-200 relative'
                onClick={() => handleMarkAsRead(training._id)}
              >
                {currentUser?.role === 'player' && training.isNew && (
                  <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'>
                    <Badge className='bg-gray-600 text-white px-3 py-1 rounded-full animate-pulse flex items-center space-x-1'>
                      <FaStar className='w-4 h-4 mr-1' />
                      <span className='font-bold'>New</span>
                    </Badge>
                  </div>
                )}
                <div className='p-6 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0'>
                  <div className='flex-1 space-y-2'>
                    <div className='flex items-center space-x-3'>
                      <h4 className='text-lg font-semibold text-gray-900'>
                        {training.name}
                      </h4>
                      {renderTrainingStatus()}
                    </div>
                    <div className='flex items-center space-x-3 text-gray-600'>
                      <Badge variant='secondary' className='text-xs'>
                        {training.trainingType?.split(':')[1]}
                      </Badge>
                    </div>
                  </div>

                  <div className='text-sm text-gray-500 space-y-2 md:text-right'>
                    <div className='flex items-center space-x-2 justify-start md:justify-end'>
                      <FaCalendar className='w-4 h-4 text-gray-400' />
                      <span>
                        {new Date(training.trainingDate).toLocaleDateString(
                          'en-GB',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                    <div className='flex items-center space-x-2 justify-start md:justify-end'>
                      <FaClock className='w-4 h-4 text-gray-400' />
                      <span>
                        {new Date(training.trainingDate).toLocaleTimeString(
                          'en-GB',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          renderEmptyState()
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveTrainings;
