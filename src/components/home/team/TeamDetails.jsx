import { Card, CardContent, CardDescription, CardHeader } from '../../ui/card';

/* eslint-disable react/prop-types */
const TeamDetails = ({ data }) => {
  return (
    <article>
      <Card className=' mx-auto mt-8 p-8 w-full'>
        <CardHeader className='grid grid-flow-col justify-between mb-4 text-heading3-bold p-1 '>
          {data.name}
          {data.logo && (
            <img
              src={data.logo}
              alt={`Logo of ${data.name}`}
              className='object-contain w-full h-28 rounded-md'
            />
          )}
        </CardHeader>
        <CardContent>
          <CardDescription className='text-gray-500 mb-4 '>
            {data.bio}
          </CardDescription>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
            <div>
              <p className='text-gray-700 font-semibold'>Founded:</p>
              <p>{data.yearFounded}</p>
            </div>
            <div>
              <p className='text-gray-700 font-semibold'>Coach:</p>
              <p>{data.coach}</p>
            </div>
          </div>

          <div>
            <p className='text-gray-700 font-semibold'>Stadium:</p>
            <p>{data.stadium}</p>
          </div>
        </CardContent>
      </Card>
    </article>
  );
};

export default TeamDetails;
