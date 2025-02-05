import { cloneElement, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../../ui/badge';
import Spinner from '../../Spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import SquadTable from './SquadTable';
import TeamMatches from './TeamMatches';
import { Button } from '../../ui/button';
import TeamResult from './TeamResult';
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
import { GetTeamById } from '../../../api/getTeamById';

const profileTabs = [
  { value: 'results', label: 'Results', icon: <MdOutlineScoreboard /> },
  { value: 'matches', label: 'Matches', icon: <MdOutlineCalendarMonth /> },
  { value: 'squad', label: 'Squad', icon: <FaPeopleGroup /> },
  { value: 'teamStats', label: 'Team Stats', icon: <MdPoll /> },
];

const TeamDetails = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { id: teamId } = useParams();
  const [isChanged, setIsChanged] = useState(false);
  const { team, loading } = GetTeamById(teamId, isChanged);
  const [isFan, setIsFan] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('results');

  useEffect(() => {
    const checkIfFan = async () => {
      try {
        const res = await fetch(`/api/team/is-fan/${teamId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser?._id }),
        });
        const data = await res.json();
        setIsFan(data.isFan);
      } catch (error) {
        console.error('Error checking fan status:', error);
      }
    };

    if (currentUser && teamId) {
      checkIfFan();
    }
  }, [currentUser, teamId, isChanged]);

  const handleFollowAction = async (action) => {
    try {
      const res = await fetch(`/api/team/${action}/${teamId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser?._id }),
      });

      if (res.ok) {
        toast({
          title: 'Success!',
          description: `You are now ${
            action === 'follow' ? 'following' : 'no longer following'
          } this team`,
        });
        setIsChanged(!isChanged);
      } else {
        toast({
          title: 'Error!',
          description: `Failed to ${action} team`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(`Error ${action}ing team:`, error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await fetch(`/api/team/download-pdf/${teamId}`);
      if (!res.ok)
        throw new Error(`Failed to download PDF. Status: ${res.status}`);

      const blob = await res.blob();
      const fileName = team?.name.replace(
        /[ąćęłńóśżź]/g,
        (match) =>
          ({
            ą: 'a',
            ć: 'c',
            ę: 'e',
            ł: 'l',
            ń: 'n',
            ó: 'o',
            ś: 's',
            ż: 'z',
            ź: 'z',
          }[match] || match)
      );
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
      toast({
        title: 'Error',
        description: 'Failed to download PDF',
        variant: 'destructive',
      });
    }
  };

  if (loading) return <Spinner />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className='min-h-screen'
    >
      <div className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <BackButton />
        </motion.div>
        <Separator className='my-6' />

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='bg-white rounded-2xl shadow-xl overflow-hidden'
        >
          <div className='px-6 py-8 sm:p-10'>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className='flex flex-col md:flex-row items-center justify-between mb-8'
            >
              <div className='flex flex-col items-center md:items-start mb-6 md:mb-0'>
                <h1 className='text-heading2-semibold font-bold text-gray-900 mb-2'>
                  {team?.name}
                </h1>

                <p className='text-lg text-gray-600'>
                  {team?.fans?.length} fans
                </p>
                {currentUser && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className='flex mt-4 space-x-4'
                  >
                    <Button
                      onClick={() => handleFollowAction('follow')}
                      disabled={isFan}
                      className='bg-purple-600 hover:bg-purple-700 text-white'
                    >
                      Follow
                    </Button>
                    <Button
                      onClick={() => handleFollowAction('unfollow')}
                      disabled={!isFan}
                      className='bg-red-600 hover:bg-red-700 text-white'
                    >
                      Unfollow
                    </Button>
                  </motion.div>
                )}
              </div>
              {team?.logoUrl && (
                <motion.img
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.6,
                    duration: 0.5,
                    type: 'spring',
                    stiffness: 200,
                  }}
                  src={
                    team.logoUrl ||
                    'https://d3awt09vrts30h.cloudfront.net/team_img_default.png'
                  }
                  alt={`Logo of ${team?.name}`}
                  className='w-40 h-40 rounded-full object-contain shadow-lg'
                />
              )}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className='text-gray-600 mb-8'
            >
              {team.bio}
            </motion.p>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className='grid grid-cols-1 md:grid-cols-2 gap-8'
            >
              <TeamInfoSection
                founded={team.yearFounded}
                stadium={team.stadium}
                country={team.country?.name}
              />
              <TeamInfoSection
                league={team.league?.name}
                coach={team.coach}
                onDownload={handleDownloadPDF}
              />
            </motion.div>
          </div>

          <div className='bg-gray-50 px-6 py-8 sm:p-10'>
            <Tabs defaultValue='results' onValueChange={setActiveTab}>
              <TabsList className='flex justify-center space-x-4 mb-8'>
                {profileTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.label}
                    value={tab.value}
                    className='flex items-center justify-center space-x-2 text-purple-600 font-semibold cursor-pointer transition-all duration-200 ease-in-out hover:bg-purple-600 hover:text-white px-4 py-2 rounded-md'
                  >
                    <motion.div>
                      {cloneElement(tab.icon, { className: 'w-6 h-6' })}
                    </motion.div>
                    <span className='hidden sm:inline'>{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
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
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const TeamInfoSection = ({
  founded,
  stadium,
  country,
  league,
  coach,
  onDownload,
}) => (
  <div className='space-y-4'>
    {founded && <InfoItem label='Founded' value={founded} />}
    {stadium && (
      <InfoItem
        label='Stadium'
        value={
          <Link to={`/stadium/${stadium._id}`}>
            <Badge
              variant='outline'
              className='cursor-pointer hover:bg-purple-100'
            >
              {stadium.name}
            </Badge>
          </Link>
        }
      />
    )}
    {country && <InfoItem label='Country' value={country} />}
    {league && <InfoItem label='League' value={league} />}
    {coach && (
      <InfoItem
        label='Coach'
        value={
          <Link to={`/coach/${coach._id}`}>
            <Badge
              variant='outline'
              className='cursor-pointer hover:bg-purple-100'
            >{`${coach.name} ${coach.surname}`}</Badge>
          </Link>
        }
      />
    )}
    {onDownload && (
      <div>
        <p className='text-gray-700 font-semibold mb-2'>Download team info:</p>
        <Button
          onClick={onDownload}
          className='bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200'
        >
          Download PDF
        </Button>
      </div>
    )}
  </div>
);

const InfoItem = ({ label, value }) => (
  <div>
    <p className='text-gray-700 font-semibold mb-1'>{label}:</p>
    <div className='text-gray-600'>{value}</div>
  </div>
);

export default TeamDetails;
