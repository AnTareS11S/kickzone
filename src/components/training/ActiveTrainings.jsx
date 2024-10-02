import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CiClock1, CiCalendar } from 'react-icons/ci';

const ActiveTrainings = ({ trainings, isArchived }) => {
  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold'>
          {isArchived ? 'Last Trainings' : 'Upcoming Trainings'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {trainings && trainings.length > 0 ? (
          trainings.map((training) => (
            <Link
              to={`/training/${training._id}`}
              key={training._id}
              className='block'
            >
              <div className='border rounded-lg p-4 mb-4 hover:shadow-md transition-all hover:bg-gray-50 dark:hover:bg-gray-800'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <h4 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                      {training.name}
                    </h4>
                    <Badge variant='secondary'>
                      {training.trainingType?.split(':')[1]}
                    </Badge>
                  </div>
                  <div className='text-sm text-gray-500 dark:text-gray-400 space-y-1'>
                    <div className='flex items-center'>
                      <CiCalendar className='h-4 w-4 mr-2' />
                      {new Date(training.trainingDate).toLocaleDateString(
                        'en-GB',
                        {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </div>
                    <div className='flex items-center'>
                      <CiClock1 className='h-4 w-4 mr-2' />
                      {new Date(training.trainingDate).toLocaleTimeString(
                        'en-GB',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className='text-center text-gray-500 dark:text-gray-400'>
            No {isArchived ? 'completed' : 'active'} trainings at the moment.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveTrainings;
