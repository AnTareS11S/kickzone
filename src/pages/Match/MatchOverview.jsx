import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { FaRegClock, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

const MatchOverview = ({ match }) => {
  // Assuming match object contains necessary data

  // zrobic zeby pod spodem bylo W/L/D

  return (
    <Card className='w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden'>
      <CardHeader className='bg-gradient-to-r from-primary-500 to-purple-500 text-white p-6'>
        <div className='flex justify-between items-center'>
          <CardTitle className='text-2xl font-bold'>{'fff'}</CardTitle>
          <Badge variant='secondary' className='text-sm'>
            {'status'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
          <TeamDisplay team={'homeTeam'} score={'homeScore'} isHome={'true'} />
          <div className='text-4xl font-bold my-4 md:my-0'>VS</div>
          <TeamDisplay team={'awayTeam'} score={'awayScore'} isHome={'false'} />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600'>
          <InfoItem
            icon={FaRegClock}
            label='Date & Time'
            value={`${'date'} ${'time'}`}
          />
          <InfoItem icon={FaMapMarkerAlt} label='Venue' value={'venue'} />
          <InfoItem icon={FaUser} label='Referee' value={'referee'} />
        </div>
      </CardContent>
    </Card>
  );
};

const TeamDisplay = ({ team, score, isHome }) => (
  <div
    className={`flex flex-col items-center ${
      isHome ? 'md:items-end' : 'md:items-start'
    }`}
  >
    <img src={team.logo} alt={`${team.name} logo`} className='w-16 h-16 mb-2' />
    <h2 className='text-xl font-semibold'>{team.name}</h2>
    <p className='text-3xl font-bold'>{score}</p>
  </div>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className='flex items-center space-x-2'>
    <Icon className='text-primary-500' />
    <div>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='font-medium'>{value}</p>
    </div>
  </div>
);

export default MatchOverview;
