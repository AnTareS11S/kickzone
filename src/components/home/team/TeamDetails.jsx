import { Link } from 'react-router-dom';
import { Badge } from '../../ui/badge';
import Spinner from '../../Spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import SquadTable from './SquadTable';
import TeamMatches from './TeamMatches';
import { Button } from '../../ui/button';
import TeamResult from './TeamResult';

const profileTabs = [
  { value: 'results', label: 'Results', icon: '/results.png' },
  { value: 'matches', label: 'Matches', icon: '/calendar.png' },
  { value: 'squad', label: 'Squad', icon: '/check.png' },
];

const TeamDetails = ({ data, isLoading }) => {
  const handleDownloadPDF = async () => {
    try {
      const res = await fetch(`/api/team/download-pdf/${data?._id}`);

      if (!res.ok) {
        throw new Error(`Failed to download PDF. Status: ${res.status}`);
      }

      const blob = await res.blob();
      const fileName = sanitizeFileName(data?.name);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const polishToEnglish = {
    ą: 'a',
    ć: 'c',
    ę: 'e',
    ł: 'l',
    ń: 'n',
    ó: 'o',
    ś: 's',
    ż: 'z',
    ź: 'z',
  };

  const sanitizeFileName = (fileName) => {
    return fileName.replace(
      /[ąćęłńóśżź]/g,
      (match) => polishToEnglish[match] || match
    );
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
        <div className='px-6 py-8 sm:px-8 sm:py-10'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-heading2-semibold font-bold text-gray-900'>
              {data?.name}
            </h2>

            {data?.logoUrl && (
              <img
                src={
                  data?.logoUrl ||
                  'https://d3awt09vrts30h.cloudfront.net/team_img_default.png'
                }
                alt={`Logo of ${data?.name}`}
                className='w-32 h-32 rounded-md object-contain'
              />
            )}
          </div>
          <div className='flex items-center space-x-1 mb-5'>
            <p className='text-gray-600 font-semibold'>
              {data?.sponsor ? 'Sponsored by ' : null}
            </p>
            <p className='text-gray-600 font-semibold hover:text-gray-900'>
              <Link to={data?.sponsor?.website} target='_blank'>
                {data?.sponsor?.name}
              </Link>
            </p>
          </div>
          <p className='text-gray-600 mb-8'>{data.bio}</p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
            <div>
              <div className='mb-4'>
                <p className='text-gray-700 font-semibold mb-1'>Founded:</p>
                <p>{data.yearFounded}</p>
              </div>
              <div className='mb-4'>
                <p className='text-gray-700 font-semibold mb-1'>Stadium:</p>
                <Link to={`/stadium/${data.stadium?._id}`}>
                  <Badge variant='outline'>{data.stadium?.name}</Badge>
                </Link>
              </div>
              <div>
                <p className='text-gray-700 font-semibold mb-1'>Country:</p>
                <p>{data.country?.name}</p>
              </div>
            </div>
            <div>
              <div className='mb-4'>
                <p className='text-gray-700 font-semibold mb-1'>League:</p>
                <p>{data.league?.name}</p>
              </div>
              <div className='mb-4'>
                <p className='text-gray-700 font-semibold mb-1'>Coach:</p>
                <Link to={`/coach/${data.coach?._id}`}>
                  <Badge variant='outline'>
                    {data.coach?.name} {data?.coach?.surname}
                  </Badge>
                </Link>
              </div>
              <div>
                <p className='text-gray-700 font-semibold mb-2'>
                  Download team info:
                </p>
                <Button
                  className='bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded'
                  onClick={handleDownloadPDF}
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-gray-100 px-6 py-8 sm:px-8 sm:py-10'>
          <Tabs defaultValue='results'>
            <TabsList className='flex justify-center space-x-4 mb-8'>
              {profileTabs.map((tab) => (
                <TabsTrigger
                  key={tab.label}
                  value={tab.value}
                  className='flex items-center justify-center space-x-2 text-purple-600 font-semibold cursor-pointer transition-colors duration-200 ease-in-out hover:bg-purple-600 hover:text-white px-4 py-2 rounded-md'
                >
                  <img
                    src={tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                  <span className='hidden sm:inline'>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value='results'>
              <TeamResult />
            </TabsContent>
            <TabsContent value='matches'>
              <TeamMatches />
            </TabsContent>
            <TabsContent value='squad'>
              <SquadTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
