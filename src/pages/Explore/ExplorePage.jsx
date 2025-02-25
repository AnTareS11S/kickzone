import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

import Spinner from '../../components/Spinner';
import MatchCard from '../../components/home/explore/MatchCard';
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { FiAlertCircle } from 'react-icons/fi';

const NoMatchesAlert = ({ title, description }) => (
  <AlertDialog variant='default' className='mb-4'>
    <FiAlertCircle className='h-4 w-4' />
    <AlertDialogTitle>{title}</AlertDialogTitle>
    <AlertDialogDescription>{description}</AlertDialogDescription>
  </AlertDialog>
);

const ExplorePage = () => {
  const [todaysMatches, setTodaysMatches] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodaysMatches = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/today-matches`
        );
        const data = await res.json();
        setTodaysMatches(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTodaysMatches();
  }, []);

  useEffect(() => {
    const fetchRecentResults = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/recent-results`
        );
        const data = await res.json();
        setRecentResults(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecentResults();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid md:grid-cols-2 gap-8'>
        <Card className='md:col-span-1'>
          <CardHeader className='bg-gradient-to-r from-primary-500 to-purple-500 text-white'>
            <CardTitle className='flex items-center text-2xl'>
              <span className='mr-2'>&#128197;</span>
              Today&apos;s Matches
            </CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            {todaysMatches.length > 0 ? (
              todaysMatches.map((match) => (
                <MatchCard
                  key={match?.matchId}
                  match={match}
                  isPlayed={false}
                />
              ))
            ) : (
              <NoMatchesAlert
                title='No Matches Today'
                description='There are no scheduled matches for today. Check back later for updates!'
              />
            )}
          </CardContent>
        </Card>

        <Card className='md:col-span-1'>
          <CardHeader className='bg-gradient-to-r from-green-500 to-green-600 text-white'>
            <CardTitle className='flex items-center text-2xl'>
              <span className='mr-2'>&#127942;</span>
              Recent Results
            </CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            {recentResults.length > 0 ? (
              recentResults.map((match) => (
                <MatchCard
                  key={match?.resultId}
                  match={match}
                  isPlayed={true}
                />
              ))
            ) : (
              <NoMatchesAlert
                title='No Recent Results'
                description='There are no recent match results available at the moment.'
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExplorePage;
