import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
} from '@vis.gl/react-google-maps';
import BackButton from '../../components/BackButton';
import { Separator } from '../../components/ui/separator';

const StadiumPage = () => {
  const stadiumId = useLocation().pathname.split('/').pop();
  const [stadium, setStadium] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const position = {
    lat: parseFloat(stadium?.location?.split(',')[0]),
    lng: parseFloat(stadium?.location?.split(',')[1]),
  };

  useEffect(() => {
    const getStadium = async () => {
      try {
        const res = await fetch(`/api/admin/stadium/${stadiumId}`);
        const data = await res.json();
        setStadium(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getStadium();
  }, [stadiumId]);

  if (loading)
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner />
      </div>
    );

  return (
    <>
      <BackButton />
      <Separator />
      <Card className='bg-white shadow-lg p-6 rounded-md'>
        <CardHeader className='mb-4 flex items-center flex-row'>
          <div className='w-40 h-40'>
            <img
              src={
                stadium.photo ||
                'https://firebasestorage.googleapis.com/v0/b/futbolistapro.appspot.com/o/avatars%2Fstadium.jpg?alt=media&token=86bfc18b-e2ba-46c5-ab9c-358ec82c7aa0'
              }
              alt={`Photo of ${stadium.name}`}
              className='object-cover rounded-full mt-4'
            />
          </div>
          <div className='ml-4 flex flex-col justify-between'>
            <CardTitle className='text-heading2-semibold mb-2'>
              {stadium.name}
            </CardTitle>
            <CardDescription className='text-gray-700'>
              {stadium.history}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='grid grid-cols-2 gap-6 pl-12'>
          <div>
            <p className='text-sm font-semibold text-gray-500'>Country:</p>
            <p className='text-gray-800'>{stadium?.country?.name}</p>
          </div>
          <div>
            <p className='text-sm font-semibold text-gray-500'>City:</p>
            <p className='text-gray-800'>{stadium.city}</p>
          </div>
          <div>
            <p className='text-sm font-semibold text-gray-500'>Capacity:</p>
            <p className='text-gray-800'>
              {stadium.capacity ? `${stadium.capacity} seats` : 'N/A'}
            </p>
          </div>
          <div>
            <p className='text-sm font-semibold text-gray-500'>Teams:</p>
            <ul className='list-disc pl-4 text-gray-800'>
              {stadium.teams?.map((team, index) => (
                <li key={index}>{team.split(':')[0]}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      {position ? (
        <div style={{ height: '100vh', width: '100%' }}>
          <APIProvider apiKey={import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY}>
            <Map
              defaultZoom={13}
              defaultCenter={position}
              mapId={import.meta.env.VITE_PUBLIC_MAP_ID}
              gestureHandling={'greedy'}
            >
              <AdvancedMarker
                position={position}
                onClick={() => setOpen(true)}
              ></AdvancedMarker>
              {open && (
                <InfoWindow
                  position={position}
                  onCloseClick={() => setOpen(false)}
                >
                  <p>{stadium.name} Stadium</p>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>
      ) : null}
    </>
  );
};

export default StadiumPage;
