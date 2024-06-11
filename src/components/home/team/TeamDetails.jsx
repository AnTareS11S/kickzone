import { Link, useParams } from 'react-router-dom';
import { Badge } from '../../ui/badge';
import Spinner from '../../Spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import SquadTable from './SquadTable';
import TeamMatches from './TeamMatches';
import { Button } from '../../ui/button';
import TeamResult from './TeamResult';
import { useSelector } from 'react-redux';
import { useFetchTeamById } from '../../hooks/useFetchTeamById';
import { useEffect, useState } from 'react';
import BackButton from '../../BackButton';
import { Separator } from '../../ui/separator';
import { useToast } from '../../ui/use-toast';
import {
  MdOutlineScoreboard,
  MdOutlineCalendarMonth,
  MdPoll,
} from 'react-icons/md';
import { FaPeopleGroup } from 'react-icons/fa6';
import TeamStats from './TeamStats';

const profileTabs = [
  {
    value: 'results',
    label: 'Results',
    icon: <MdOutlineScoreboard className='w-8 h-8 text-black' />,
  },
  {
    value: 'matches',
    label: 'Matches',
    icon: <MdOutlineCalendarMonth className='w-8 h-8 text-black' />,
  },
  {
    value: 'squad',
    label: 'Squad',
    icon: <FaPeopleGroup className='w-8 h-8 text-black' />,
  },
  {
    value: 'teamStats',
    label: 'Team Stats',
    icon: <MdPoll className='w-8 h-8 text-black' />,
  },
];

const TeamDetails = () => {
  const { currentUser } = useSelector((state) => state.user);
  const teamId = useParams().id;
  const [isChanged, setIsChanged] = useState(false);
  const { team, loading } = useFetchTeamById(teamId, isChanged);
  const [isFan, setIsFan] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkIfFan = async () => {
      try {
        const res = await fetch(`/api/team/is-fan/${teamId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: currentUser?._id }),
        });
        const data = await res.json();

        setIsFan(data.isFan);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser && teamId) {
      checkIfFan();
    }
  }, [currentUser, teamId, isChanged]);

  const handleFollow = async () => {
    try {
      const res = await fetch(`/api/team/follow/${teamId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser?._id }),
      });

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'You are now following this team',
        });
        setIsChanged(!isChanged);
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to follow team',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const res = await fetch(`/api/team/unfollow/${teamId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser?._id }),
      });

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'You are no longer following this team',
        });
        setIsChanged(!isChanged);
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to unfollow team',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await fetch(`/api/team/download-pdf/${teamId}`);

      if (!res.ok) {
        throw new Error(`Failed to download PDF. Status: ${res.status}`);
      }

      const blob = await res.blob();
      const fileName = sanitizeFileName(team?.name);
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

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <BackButton />
      <Separator />
      <div className='max-w-screen-xl mx-auto px-4 py-12'>
        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          <div className='px-6 py-8 sm:px-8 sm:py-10'>
            <div className='flex flex-col sm:flex-row items-center justify-between mb-6'>
              <div className='flex flex-col sm:flex-row items-center space-x-4 mb-4 sm:mb-0'>
                <h2 className='text-heading2-semibold font-bold text-gray-900'>
                  {team?.name}
                </h2>
                <span className='text-gray-600 font-semibold'>
                  {team?.fans?.length} fans
                </span>
                {currentUser && (
                  <div className='flex items-center space-x-2 mt-2 sm:mt-0'>
                    <Button
                      className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-1.5 px-4 rounded-full flex items-center space-x-2 transition-all duration-300 ease-in-out ${
                        isFan ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={handleFollow}
                      disabled={isFan}
                    >
                      <span className='text-sm'>Follow</span>
                    </Button>
                    <Button
                      className={`bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-1.5 px-4 rounded-full flex items-center space-x-2 transition-all duration-300 ease-in-out ${
                        !isFan ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={handleUnfollow}
                      disabled={!isFan}
                    >
                      <span className='text-sm'>Unfollow</span>
                    </Button>
                  </div>
                )}
              </div>
              {team?.logoUrl && (
                <img
                  src={
                    team?.logoUrl ||
                    'https://d3awt09vrts30h.cloudfront.net/team_img_default.png'
                  }
                  alt={`Logo of ${team?.name}`}
                  className='w-32 h-32 rounded-md object-contain mt-4 sm:mt-0'
                />
              )}
            </div>
            <div className='flex items-center space-x-1 mb-5'>
              <p className='text-gray-600 font-semibold'>
                {team?.sponsor ? 'Sponsored by ' : null}
              </p>
              {team?.sponsor && (
                <p className='text-gray-600 font-semibold hover:text-gray-900'>
                  <Link to={team?.sponsor?.website} target='_blank'>
                    {team?.sponsor?.name}
                  </Link>
                </p>
              )}
            </div>
            <p className='text-gray-600 mb-8'>{team.bio}</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
              <div>
                <div className='mb-4'>
                  <p className='text-gray-700 font-semibold mb-1'>Founded:</p>
                  <p>{team.yearFounded}</p>
                </div>
                <div className='mb-4'>
                  <p className='text-gray-700 font-semibold mb-1'>Stadium:</p>
                  <Link to={`/stadium/${team.stadium?._id}`}>
                    <Badge variant='outline'>{team.stadium?.name}</Badge>
                  </Link>
                </div>
                <div>
                  <p className='text-gray-700 font-semibold mb-1'>Country:</p>
                  <p>{team.country?.name}</p>
                </div>
              </div>
              <div>
                <div className='mb-4'>
                  <p className='text-gray-700 font-semibold mb-1'>League:</p>
                  <p>{team.league?.name}</p>
                </div>
                <div className='mb-4'>
                  <p className='text-gray-700 font-semibold mb-1'>Coach:</p>
                  <Link to={`/coach/${team.coach?._id}`}>
                    <Badge variant='outline'>
                      {team.coach?.name} {team?.coach?.surname}
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
                    {tab.icon}
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
              <TabsContent value='teamStats'>
                <TeamStats />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamDetails;
