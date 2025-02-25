import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import { CardDescription, CardTitle } from '../../components/ui/card';

import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
} from '@vis.gl/react-google-maps';
import BackButton from '../../components/BackButton';
import { Separator } from '../../components/ui/separator';

const StadiumPage = () => {
  const stadiumId = useParams().id;
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
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/stadium/${stadiumId}`
        );
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

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='bg-white shadow-lg rounded-lg p-6 md:p-8 lg:p-10'>
      <BackButton />
      <Separator />
      <div className='flex flex-col md:flex-row md:items-center'>
        <div className='w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6'>
          <img
            src={stadium.imageUrl}
            alt={`Photo of ${stadium.name}`}
            className='object-cover w-full h-full'
          />
        </div>
        <div className='flex-grow'>
          <CardTitle className='text-heading2-semibold mb-2'>
            {stadium.name}
          </CardTitle>
          <CardDescription className='text-gray-600 mb-4'>
            {stadium.history}
          </CardDescription>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
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
          </div>
        </div>
      </div>
      {position ? (
        <div className='mt-6'>
          <APIProvider apiKey={import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY}>
            <Map
              defaultZoom={13}
              defaultCenter={position}
              mapId={import.meta.env.VITE_PUBLIC_MAP_ID}
              gestureHandling={'greedy'}
              style={{ height: '400px', width: '100%' }}
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
    </div>
  );
};

export default StadiumPage;
