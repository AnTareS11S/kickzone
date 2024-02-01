/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../ui/card';

const ActiveTrainings = ({ trainings, isArchived }) => {
  return (
    <Card className='mb-5 mt-5'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-heading4-medium font-medium'>
              {isArchived ? 'Last trainings' : 'Upcoming trainings'}
            </h3>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {trainings?.map((training) => (
          <Link to={`/training/${training?._id}`} key={training?._id}>
            <div className='border cursor-pointer p-4 rounded-md hover:shadow-md transition-all mb-4 hover:bg-gray-200 '>
              <div className='flex items-center justify-between p-2 rounded-md transition-all'>
                <div className='flex items-center space-x-4'>
                  <p className='text-sm text-gray-800 font-semibold'>
                    {training?.name}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {training?.trainingType?.split(':')[1]}
                  </p>
                </div>
                <div className='flex items-center space-x-4'>
                  <p className='text-sm text-gray-500'>
                    {new Date(training?.trainingDate).toLocaleDateString(
                      'en-GB',
                      {
                        day: 'numeric',
                        month: 'long',
                      }
                    )}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {new Date(training?.trainingDate).toLocaleTimeString(
                      'en-GB',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActiveTrainings;
