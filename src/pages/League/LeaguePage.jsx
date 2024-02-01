/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import TableComponent from '../../components/home/leagues/TableComponent';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';

import TeamCard from '../../components/home/leagues/TeamCard';
import { Separator } from '../../components/ui/separator';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner';

const LeaguePage = () => {
  const [teamsStats, setTeamsStats] = useState([]);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const pathname = window.location.pathname;

  const getTeamsStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/league/teams-stats/${pathname.split('/').pop()}`
      );
      const data = await res.json();
      setTeamsStats(data.teamStats);
      setTeams(data.teams);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeamsStats();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div
        className='cursor-pointer mb-2 inline-flex items-center justify-center bg-primary-500 hover:bg-purple-500 text-white font-bold py-1 px-3 rounded'
        onClick={() => navigate(-1)}
      >
        <span className='mr-1'>&#8592;</span> Back
      </div>
      <Separator />
      <h1 className='text-heading2-bold mb-10'>{teamsStats.title}</h1>
      <Tabs defaultValue='teams' className='w-full'>
        <TabsList className='flex flex-wrap text-body-medium gap-3 max-sm:mb-16 max-md:mb-14 max-lg:mb-14'>
          <TabsTrigger value='teams'>Teams</TabsTrigger>
          <TabsTrigger value='standings'>Standings</TabsTrigger>
          <TabsTrigger value='top_scorers'>Top Scorers</TabsTrigger>
          <TabsTrigger value='top_assistents'>Top Assistents</TabsTrigger>
          <TabsTrigger value='y_cards'>Yellow Cards</TabsTrigger>
          <TabsTrigger value='r_cards'>Red Cards</TabsTrigger>
        </TabsList>
        <TabsContent value='teams'>
          <TeamCard data={teams} />
        </TabsContent>
        <TabsContent value='standings'>
          <TableComponent data={teamsStats} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default LeaguePage;
