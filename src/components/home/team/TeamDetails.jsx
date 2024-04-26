import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader } from '../../ui/card';
import { Badge } from '../../ui/badge';
import Spinner from '../../Spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Separator } from '../../ui/separator';
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
    const res = await fetch(`/api/team/download-pdf/${data._id}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data?.name}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  if (isLoading)
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner />
      </div>
    );

  return (
    <article>
      <Card className='mx-auto p-8 w-full'>
        <CardHeader className='grid grid-flow-col justify-between mb-4 text-heading3-bold p-1 '>
          {data?.name}
          {data?.logo && (
            <img
              src={data?.logo}
              alt={`Logo of ${data?.name}`}
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
              <div className='mb-4'>
                <p className='text-gray-700 font-semibold'>Founded:</p>
                <p>{data.yearFounded}</p>
              </div>
              <div>
                <p className='text-gray-700 font-semibold'>Stadium:</p>
                <Link to={`/stadium/${data.stadium?.split(':')[1]}`}>
                  <Badge variant='outline'>{data.stadium?.split(':')[0]}</Badge>
                </Link>
              </div>
              <div className='mt-4'>
                <p className='text-gray-700 font-semibold'>Country:</p>
                <p>{data.country}</p>
              </div>
            </div>
            <div>
              <div>
                <p className='text-gray-700 font-semibold'>League:</p>
                <p>{data.league}</p>
              </div>
              <div className='mt-4'>
                <p className='text-gray-700 font-semibold'>Coach:</p>
                <Link to={`/coach/${data.coach?.split(':')[1]}`}>
                  <Badge variant='outline'>{data.coach?.split(':')[0]}</Badge>
                </Link>
              </div>
              <div className='mt-4'>
                <p className='text-gray-700 font-semibold'>
                  Download team info:
                </p>
                <Button
                  className='bg-primary-500 hover:bg-purple-500'
                  onClick={handleDownloadPDF}
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <Separator />
        <Tabs
          defaultValue='squad'
          className='w-full items-center justify-center mt-10 p-2 rounded-full'
        >
          <TabsList className='space-x-4 w-full'>
            {profileTabs.map((tab) => (
              <TabsTrigger
                key={tab.label}
                value={tab.value}
                className='items-center w-full space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer '
              >
                <img
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>
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
      </Card>
    </article>
  );
};

export default TeamDetails;
